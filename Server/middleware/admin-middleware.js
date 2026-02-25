const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-this";

const adminMiddleware = (req, res, next) => {
    try {
        // קבל את ה-token מה-header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token לא נמצא' });
        }

        // בדוק את ה-token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // בדוק אם ה-role הוא admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'נדרש הרשאת admin' });
        }

        // הוסף את המשתמש ל-request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token לא חוקי' });
    }
};

module.exports = adminMiddleware;
