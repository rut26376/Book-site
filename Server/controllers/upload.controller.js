const fs = require('fs');
const path = require('path');

// התיקייה לשמירת התמונות
const uploadDir = path.join(__dirname, '../../Client/src/assets/book-img');

/**
 * Upload single image controller
 * Middleware already handled file storage
 */
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file was uploaded'
      });
    }

    // קבל את שם הקובץ הרצוי מ-request body
    const desiredFilename = req.body.filename;
    
    if (!desiredFilename) {
      return res.status(400).json({
        success: false,
        error: 'No filename provided'
      });
    }

    // קבל את שם הקובץ שנשמר כרגע (שם מקורי)
    const currentPath = req.file.path;
    const newPath = path.join(uploadDir, desiredFilename);

    // שנה שם את הקובץ מהשם המקורי לשם הרצוי
    fs.renameSync(currentPath, newPath);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      filename: desiredFilename,
      path: `/assets/book-img/${desiredFilename}`,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    console.log(`✅ Image saved: ${desiredFilename} (${req.file.size} bytes)`);
  } catch (error) {
    console.error('❌ Upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during upload'
    });
  }
};

/**
 * Upload multiple images controller (future use)
 */
exports.uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files were uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: `/assets/book-img/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      files: uploadedFiles,
      count: req.files.length
    });

    console.log(`✅ ${req.files.length} images saved`);
  } catch (error) {
    console.error('❌ Multiple upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during upload'
    });
  }
};
