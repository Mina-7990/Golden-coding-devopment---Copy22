const express = require('express');
const { register, login, getUserLessons } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const router = express.Router();

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

// المسارات
router.post('/register', register);
router.post('/login', login);
router.get('/my-lesson', protect, getUserLessons); // استخدام الميدل وير protect هنا

// الحصول على بيانات المستخدم الشخصية (البروفايل)

module.exports = router;
