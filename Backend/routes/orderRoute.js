const express = require('express');

const router = express.Router();

const authenticationMiddleware = require('../middlewares/authorization');

const ordersController = require('../controllers/ordersController');

router.post('/checkout/add', authenticationMiddleware.authentication, ordersController.orderCheckout);

router.get('/checkout/get', authenticationMiddleware.authentication, ordersController.getCheckout);

router.get('/get', authenticationMiddleware.authentication, ordersController.getOrders);

router.patch('/cancel', authenticationMiddleware.authentication, ordersController.cancelOrder);

module.exports = router;