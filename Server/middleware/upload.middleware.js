const upload = require('../config/multer.config');

/**
 * Middleware for single image upload
 * Handles file validation and storage
 */
const uploadSingleImage = (req, res, next) => {
  const singleUpload = upload.single('file');

  console.log('⬆️ === בדיקת תמונה בפעם ראשונה ===');
  console.log('Query params:', req.query);
  console.log('filename param:', req.query.filename);

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

    console.log('📄 שם הקובץ שהתקבל במידלוור:', req.file.filename);
    console.log('📂 נתיב מלא:', req.file.path);

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

    next();
  });
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages
};

