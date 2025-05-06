const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'mediflow-app-storage';

// Utility function to generate pre-signed URL for patient photos
const getPatientPhoto = async (photoUrl, expiresInSeconds = 900) => {
  try {
    if (!photoUrl) {
      throw new Error('No photo URL provided');
    }
    
    // Handle different formats of stored photo URL/key
    let key;
    
    if (photoUrl.startsWith('http')) {
      // If it's a full URL, extract the key
      const url = new URL(photoUrl);
      key = decodeURIComponent(url.pathname.substring(1)); // Remove leading '/'
    } else {
      // If it's already just a key
      key = photoUrl;
    }
    
    // Generate a pre-signed URL
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: expiresInSeconds
    });
    
    return {
      url: signedUrl,
      expiresIn: `${Math.floor(expiresInSeconds / 60)} minutes`
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};

const uploadPatientPhoto = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `patients/photos/${uuidv4()}${fileExtension}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
}).single('photo');

module.exports = { s3, uploadPatientPhoto, getPatientPhoto };