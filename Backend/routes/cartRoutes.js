const express = require('express');

const router = express.Router();

const authenticationMiddleware = require('../middlewares/authorization');

const cartController = require('../controllers/cartController');

router.post('/add', authenticationMiddleware.authentication, cartController.addToCart);

router.get('/get', authenticationMiddleware.authentication, cartController.getCart);

router.delete('/delete/:id', authenticationMiddleware.authentication, cartController.deleteCart);

module.exports = router;