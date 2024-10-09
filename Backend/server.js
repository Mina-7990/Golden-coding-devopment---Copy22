const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const lessonRoutes = require('./routers/lessonRoutes');
const codeRoutes = require('./routers/codeRoutes');
const connectDB = require('./config/configDB');

dotenv.config();





// إنشاء تطبيق Express
const app = express();
const cors = require('cors');
app.use(cors());
// تفعيل قراءة البيانات بصيغة JSON
app.use(express.json());

// توصيل بقاعدة البيانات

dotenv.config();
connectDB();

// استخدام الروابط المختلفة
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/codes', codeRoutes);

// تشغيل السيرفر على المنفذ المحدد
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
