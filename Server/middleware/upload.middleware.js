const upload = require('../config/multer.config');

/**
 * Middleware for single image upload
 * Handles file validation and storage
 */
const uploadSingleImage = (req, res, next) => {
  const singleUpload = upload.single('file');

  singleUpload(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    console.log(`✅ File received: ${req.file.filename}`);
    next();
  });
};

/**
 * Middleware for multiple images upload
 * Handles batch file uploads
 */
const uploadMultipleImages = (req, res, next) => {
  const multiUpload = upload.array('files', 10);

  multiUpload(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message || 'Files upload failed'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files provided'
      });
    }

    console.log(`✅ Files received: ${req.files.length} files`);
    next();
  });
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages
};

