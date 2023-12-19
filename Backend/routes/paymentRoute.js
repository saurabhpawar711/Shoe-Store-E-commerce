const express = require('express');

const router = express.Router();

const authenticationMiddleware = require('../middlewares/authorization');

const paymentController = require('../controllers/paymentController');

router.post('/create-checkout-session', authenticationMiddleware.authentication, paymentController.paymentGateway);

router.post('/cod', authenticationMiddleware.authentication, paymentController.paymentCod);

module.exports = router;