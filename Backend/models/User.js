const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    number: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    isOtpValid: {
        type: Boolean,
        required: true,
        default: false,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
