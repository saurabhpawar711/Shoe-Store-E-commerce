const Cart = require('../models/Cart');
require('../models/Product');

exports.addToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userNumber = req.user.number;

        const userhasCart = await Cart.findOne({ user: userNumber });

        if (userhasCart) {
            const data = await Cart.findOne(
                { user: userNumber, 'items.product': productId },
                { 'items.$': 1 }
            )

            if (!data) {
                userhasCart.items.push({ product: productId, quantity: 1 });
                await userhasCart.save();
            }
            else {
                const newQuantity = data.items[0].quantity + 1;
                await Cart.findOneAndUpdate(
                    { user: userNumber, 'items.product': productId },
                    { $set: { 'items.$.quantity': newQuantity } }
                )
            }
        }

        else {
            const cartItems = new Cart({
                user: userNumber,
                items: [{
                    product: productId,
                    quantity: 1
                }]
            })
            await cartItems.save();
        }
        res.status(201).json({ success: true, message: 'Successfully added to cart' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Error while adding to cart' });
    }
}

exports.getCart = async (req, res) => {
    try {
        const userNumber = req.user.number;

        const cartDetails = await Cart.findOne({ user: userNumber }, 'items')
            .populate('items.product');

        console.log(cartDetails);
        if (cartDetails.items.length === 0) {
            throw new Error('No items in cart');
        }
        else {
            res.status(200).json({ success: true, cartDetails: cartDetails.items });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: 'No items in cart' });
    }
}

exports.changeQty = async (req, res) => {
    try {
        const userNumber = req.user.number;
        const { newQty, productId } = req.body;

        const cartDetails = await Cart.findOneAndUpdate(
            { user: userNumber, 'items.product': productId },
            { $set: { 'items.$.quantity': newQty } },
            {
                new: true,
                projection: 'items',
                populate: 'items.product'
            }
        );
        res.status(200).json({ success: true, cartDetails: cartDetails.items });
    }
    catch (err) {
        res.status(500).json({ error: 'Something went wrong while changing quantity' });
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userNumber = req.user.number;
        await Cart.updateOne(
            { user: userNumber },
            { $pull: { items: { product: productId } } }
        );

        const cartDetails = await Cart.findOne({ user: userNumber }, 'items')
            .populate('items.product');

        res.status(200).json({ success: true, cartDetails: cartDetails.items });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong while deleting product from cart' });
    }
}