const express = require('express');
const router = express.Router();
const { uploadSingleImage, uploadMultipleImages } = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');

// Single image upload
router.post('/upload-image', uploadSingleImage, uploadController.uploadImage);

// Multiple images upload (future use)
router.post('/upload-images', uploadMultipleImages, uploadController.uploadMultipleImages);

module.exports = router;
