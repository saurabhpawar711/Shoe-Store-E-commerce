const jwt = require('jsonwebtoken');

exports.authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data;
        if (req.route && req.route.stack.length > 1) {
            next();
        } else {
            res.status(200).json({ success: true });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Authentication required' });
    }
}