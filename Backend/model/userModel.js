const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:{type:String,require:true, unique:true},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    lessons: [
        {
            lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
            usageDate: { type: Date }, // تاريخ استخدام الدرس
        }
    ],

});

// تشفير كلمة المرور قبل حفظها
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);