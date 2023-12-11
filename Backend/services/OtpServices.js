const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

exports.SendOtp = (number, otp) => {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: `Your Shoe Store verification code is: ${otp}`,
                to: `+91${number}`,
                from: '+12029183617',
            })
        resolve('Otp sent successfully!!');
    })
}

