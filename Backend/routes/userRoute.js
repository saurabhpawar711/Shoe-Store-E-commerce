const express = require('express');

const router = express.Router();

const userLoginController = require('../controllers/userLoginController');

router.post('/otp', userLoginController.generateOtp);

router.post('/login', userLoginController.checkOtp);

module.exports = router;