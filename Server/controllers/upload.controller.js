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

    // דפוס את הנתיב המלא של התמונה
    const fullPath = path.join(uploadDir, req.file.filename);
    console.log(`✅ Image saved successfully: ${req.file.filename}`);
    console.log(`📁 Full path: ${fullPath}`);
    console.log(`📊 Size: ${req.file.size} bytes`);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      path: `/assets/book-img/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
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
  } catch (error) {
    console.error('❌ Multiple upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during upload'
    });
  }
};
