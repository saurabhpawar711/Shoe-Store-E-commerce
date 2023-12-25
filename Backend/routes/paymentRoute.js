const express = require('express');

const router = express.Router();

const authenticationMiddleware = require('../middlewares/authorization');

const paymentController = require('../controllers/paymentController');

router.post('/create-checkout-session', authenticationMiddleware.authentication, paymentController.paymentGatewayProcess);

router.post('/cod', authenticationMiddleware.authentication, paymentController.paymentCod);

router.patch('/confirm-payment', authenticationMiddleware.authentication, paymentController.paymentConfirm);

module.exports = router;