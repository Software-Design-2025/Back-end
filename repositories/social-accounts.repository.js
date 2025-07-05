const SocialAccount = require('../models/social-accounts.model');
const { ObjectId } = require('mongodb');

async function getSocialAccount({
  userId: userId,
  platform: platform,
  accountId: accountId,
}) {
  try {
    const account = await SocialAccount.findOne({
      user_id: ObjectId.createFromHexString(userId),
      platform: platform,
      account_id: accountId,
    });

    return account;
  } catch (error) {
    console.error('Error fetching social account:', error);
    throw new Error('Failed to fetch social account');
  }
}

async function getSocialAccountOfUser({ userId: userId, platform: platform }) {
  try {
    const accounts = await SocialAccount.find({
      user_id: ObjectId.createFromHexString(userId),
      platform: platform,
    });

    return accounts;
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    throw new Error('Failed to fetch social accounts');
  }
}

async function updateSocialAccount({
  userId: userId,
  platform: platform,
  accountId: accountId,
  data: data,
}) {
  try {
    const updatedAccount = await SocialAccount.findOneAndUpdate(
      {
        user_id: ObjectId.createFromHexString(userId),
        platform: platform,
        account_id: accountId,
      },
      { $set: data },
      { new: true, upsert: true }
    );

    return updatedAccount;
  } catch (error) {
    console.error('Error updating social account:', error);
    throw new Error('Failed to update social account');
  }
}

async function insertUploadedVideo({
  userId: userId,
  platform: platform,
  accountId: accountId,
  video: video,
}) {
  try {
    await SocialAccount.findOneAndUpdate(
      {
        user_id: ObjectId.createFromHexString(userId),
        platform: platform,
        account_id: accountId,
      },
      { $addToSet: { videos: video } }
    );
  } catch (error) {
    console.error('Error inserting uploaded video:', error);
    throw new Error('Failed to insert uploaded video');
  }
}

module.exports = {
  getSocialAccount,
  getSocialAccountOfUser,
  updateSocialAccount,
  insertUploadedVideo,
};
