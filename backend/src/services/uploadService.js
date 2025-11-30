const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = /mp4|avi|mov|mkv/;
  //   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimetype = allowedTypes.test(file.mimetype);
  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   } else {
  //     cb('Error: Videos Only!');
  //   }
  // }
});

const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private'
  };
  return s3.upload(params).promise();
};

module.exports = { upload, uploadToS3 };