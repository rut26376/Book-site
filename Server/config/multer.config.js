const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory
const uploadDir = path.join(__dirname, '../../Client/src/assets/book-img');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 === קביעת תיקיית יעד ===');
    console.log('📂 תיקייה:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // קבל את השם מה-query parameter (שנשלח מה-frontend)
    const filename = req.query.filename ? decodeURIComponent(req.query.filename) : file.originalname;
    console.log('📝 === קביעת שם הקובץ ===');
    console.log('📄 Query filename:', req.query.filename);
    console.log('📄 Original filename:', file.originalname);
    console.log('📄 Final filename:', filename);
    cb(null, filename);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images allowed.`));
  }
};

// Multer configuration
const multerConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = multerConfig;
