const { customAlphabet } = require('nanoid');
const User = require('../models/User');
const { SendOtp } = require('../services/OtpServices');
const jwt = require('jsonwebtoken');


exports.generateOtp = async (req, res) => {
    try {
        const number = req.body.number;
        const nanoid = customAlphabet('1234567890', 4)
        const otp = nanoid();

        const numberFromDb = await User.findOne({ number: number });

        if (numberFromDb) {
            await User.findOneAndUpdate({ number: number }, { $set: { otp: otp, isOtpValid: true } });
        }
        else {
            const userData = new User({
                number: number,
                otp: otp,
                isOtpValid: true
            })
            await userData.save();
        }

        setTimeout(async () => {
            await User.findOneAndUpdate({ number: number }, { $set: { isOtpValid: false } });
        }, 500000);

        const data = await SendOtp(number, otp);

        res.status(201).json({ msg: data });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Error while generating OTP' });
    }
}

const createToken = (number) => {
    const token = jwt.sign({ number: number }, process.env.JWT_SECRET_KEY);
    return token;
}

exports.checkOtp = async (req, res) => {
    try {
        const { number, otp } = req.body;
        const otpFromDb = await User.findOne({ number: number, isOtpValid: true }, 'otp')
        if (!otpFromDb) {
            throw new Error('OTP expired');
        }
        if (otpFromDb.otp != otp) {
            throw new Error('Enter valid OTP');
        }
        await User.findOneAndUpdate({ number: number }, { $set: { isOtpValid: false } });
        const token = createToken(number);
        res.status(200).json({ success: true, token: token });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}