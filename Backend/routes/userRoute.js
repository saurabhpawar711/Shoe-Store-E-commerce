const express = require('express');

const router = express.Router();

const userLoginController = require('../controllers/userLoginController');

const authenticationMiddleware = require('../middlewares/authorization');

router.post('/otp', userLoginController.generateOtp);

router.post('/login', userLoginController.checkOtp);

router.get('/check-authentication', authenticationMiddleware.authentication);

module.exports = router;