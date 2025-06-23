const { ObjectId } = require("mongodb");
const { google } = require('googleapis');
const url = require('url');
const streamifier = require('streamifier');
const SocialAccount = require('../models/social-accounts.m');

const createOauth2Client = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.HOSTNAME}/api/youtube/auth/callback`
    );
}

module.exports = {
    auth: async (req, res) => {
        try {
            const oauth2Client = createOauth2Client();

            const scopes = [
                'https://www.googleapis.com/auth/youtube',
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube.force-ssl'
            ];

            const authorizationUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                include_granted_scopes: true,
                prompt: 'consent',
                state: encodeURIComponent(JSON.stringify({
                    userId: req.user.id,
                    redirectUrl: req.query.redirect_url
                }))
            });

            res.redirect(authorizationUrl);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    authCallback: async (req, res) => {
        try {
            const oauth2Client = createOauth2Client();

            let q = url.parse(req.url, true).query;
            const { userId, redirectUrl } = JSON.parse(decodeURIComponent(q.state || '{}'));

            if (q.error) {
                throw new Error(q.error_description || 'YouTube authentication failed');
            } else {
                let { tokens } = await oauth2Client.getToken({
                    code: q.code,
                    codeVerifier: ''
                });
                oauth2Client.setCredentials(tokens);

                const service = google.youtube({
                    version: 'v3',
                    auth: oauth2Client
                });

                const channelsListResponse = await service.channels.list({
                    part: 'id,snippet',
                    mine: true
                });

                if (!channelsListResponse.data.items || channelsListResponse.data.items.length === 0) {
                    return res.status(400).json({ message: 'No YouTube channel found for this account.' });
                }

                const channel = channelsListResponse.data.items[0];
                console.log(channel.snippet.thumbnails.default.url)
                const account = await SocialAccount.findOneAndUpdate(
                    {
                        user_id: ObjectId.createFromHexString(userId),
                        platform: 'youtube',
                        account_id: channel.id
                    },
                    {
                        $set: {
                            username: channel.snippet.title,
                            avatar: channel.snippet.thumbnails.default.url,
                            tokens: {
                                access_token: tokens.access_token,
                                refresh_token: tokens.refresh_token
                            }
                        }
                    },
                    {
                        new: true,     
                        upsert: true    
                    }
                );

                res.redirect(redirectUrl);
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    uploadVideo: async (req, res) => {
        try {
            const oauth2Client = createOauth2Client();
            
            const account = await SocialAccount.findOne({
                user_id: ObjectId.createFromHexString(req.user.id),
                platform: 'youtube',
                account_id: req.body.account_id
            });
            oauth2Client.setCredentials(account.tokens);

            const youtube = google.youtube({
                version: 'v3',
                auth: oauth2Client,
            });

            const response = await fetch(req.body.url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const stream = streamifier.createReadStream(buffer);

            const uploadResponse = await youtube.videos.insert({
                part: 'id,snippet,status',
                requestBody: {
                    snippet: {
                        title: req.body.title,
                        description: req.body.description,
                    },
                    status: {
                        embeddable: true,
                        privacyStatus: req.body.privacy_status,
                    },
                },
                media: {
                    body: stream
                },
            });

            await SocialAccount.findOneAndUpdate(
                {
                    user_id: ObjectId.createFromHexString(req.user.id),
                    platform: 'youtube',
                    account_id: req.body.account_id
                },
                {
                    $addToSet: {
                        videos: uploadResponse.data.id
                    }
                }
            );

            return res.status(200).json({
                message: 'Video uploaded successfully',
                video: {
                    id: uploadResponse.data.id,
                    url: `https://www.youtube.com/watch?v=${uploadResponse.data.id}`,
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    getViewCount: async (req, res) => {
        try {
            const oauth2Client = createOauth2Client();

            const account = await SocialAccount.findOne({
                user_id: ObjectId.createFromHexString(req.user.id),
                platform: 'youtube',
                account_id: req.query.account_id
            });
            if (!account) {
                return res.status(404).json({ message: 'YouTube account not found' });
            }
            oauth2Client.setCredentials(account.tokens);

            const youtube = google.youtube({
                version: 'v3',
                auth: oauth2Client,
            });
            const response = await youtube.videos.list({
                part: 'statistics',
                id: account.videos.join(',')
            });

            const statistics = response.data.items.map(item => {
                const stat = item.statistics;
                return {
                    id: item.id,
                    view_count: parseInt(stat.viewCount) || 0,
                    like_count: parseInt(stat.likeCount) || 0,
                    dislike_count: parseInt(stat.dislikeCount) || 0,
                    comment_count: parseInt(stat.commentCount) || 0
                }
            });

            const totalViews = statistics.reduce((sum, stat) => sum + stat.view_count, 0);
            const totalLikes = statistics.reduce((sum, stat) => sum + stat.like_count, 0);
            const totalDislikes = statistics.reduce((sum, stat) => sum + stat.dislike_count, 0);
            const totalComments = statistics.reduce((sum, stat) => sum + stat.comment_count, 0);

            return res.status(200).json({
                total_items: statistics.length,
                total: {
                    view_count: totalViews,
                    like_count: totalLikes,
                    dislike_count: totalDislikes,
                    comment_count: totalComments
                },
                items: statistics
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    getAccounts: async (req, res) => {
        try {
            let accounts = await SocialAccount.find({
                user_id: ObjectId.createFromHexString(req.user.id),
                platform: 'youtube'
            });

            accounts = accounts.map(account => ({
                id: account._id,
                username: account.username,
                avatar: account.avatar
            }));

            return res.status(200).json({
                total_accounts: accounts.length,
                accounts: accounts
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}