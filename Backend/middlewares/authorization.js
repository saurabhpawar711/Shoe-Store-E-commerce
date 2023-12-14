const jwt = require('jsonwebtoken');

exports.authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data;
        next();
    }
    catch(err) {
        console.log(err);
    }
}