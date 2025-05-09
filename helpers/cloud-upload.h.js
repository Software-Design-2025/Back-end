const cloudinary = require('../config/cloudinary.config');
const streamifier = require('streamifier');

const upload = (buffer, resourceType, format) => {
    console.log(resourceType, format);
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: resourceType,
            format: format
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

module.exports = async (buffer, resourceType='auto', format='auto') => {
    const result = await upload(buffer, resourceType, format);
    return result.url;
}