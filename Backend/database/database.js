const mongoose = require('mongoose');

const mongoConnection = () => {
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect(process.env.MONGODB_URI);
            resolve();
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

module.exports = mongoConnection;
