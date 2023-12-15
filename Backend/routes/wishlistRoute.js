const express = require('express');

const router = express.Router();

const authenticationMiddleware = require('../middlewares/authorization');

const wishlistController = require('../controllers/wishlistController');

router.post('/add', authenticationMiddleware.authentication, wishlistController.addToWishlist);

router.get('/get', authenticationMiddleware.authentication, wishlistController.getWishlist);

router.delete('/delete/:id', authenticationMiddleware.authentication, wishlistController.deleteFromWishlist);

module.exports = router;