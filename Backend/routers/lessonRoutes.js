const express = require('express');
const {
    addLesson,
    deleteLesson,
    getLessons,
    checkCodeAndUnlockLesson,
    getLessonById,
} = require('../controllers/lessonController');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// ميدل وير للحماية (التحقق من التوكن)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // استخدام المتغير البيئي
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token, authorization denied' });
    }
};

// ميدل وير للتحقق من صلاحيات المشرف (Admin)
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access only' });
    }
};

// المسارات مع تطبيق الميدل وير
router.post('/add', protect, admin, addLesson);
router.delete('/:id', protect, admin, deleteLesson);
router.get('/lessons', protect, getLessons);
router.post('/check-code', protect, checkCodeAndUnlockLesson);
router.get('/:id', protect, getLessonById); // روت لاسترجاع الدرس بالـID

module.exports = router;
