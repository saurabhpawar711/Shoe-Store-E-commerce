const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: Number,
        ref: 'User',
        required: true,
        index: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;