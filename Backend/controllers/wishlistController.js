
const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userNumber = req.user.number;

        const userhasWishlist = await Wishlist.findOne({ user: userNumber });

        if (userhasWishlist) {
            const data = await Wishlist.findOne(
                { user: userNumber, 'items.product': productId },
                { 'items.$': 1 }
            )

            if (!data) {
                userhasWishlist.items.push({ product: productId });
                await userhasWishlist.save();
            }
            else {
                throw new Error('Already in Wishlist');
            }
        }
        else {
            const itemlist = new Wishlist({
                user: userNumber,
                items: [{
                    product: productId
                }]
            })
            await itemlist.save();
        }
        res.status(201).json({ success: true, message: 'Successfully added to wishlist' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

exports.getWishlist = async (req, res) => {
    try {
        const userNumber = req.user.number;

        const data = await Wishlist.findOne({ user: userNumber }, 'items')
            .populate('items.product')

        if (data.items.length === 0) {
            throw new Error('No items in Wishlist');
        }

        res.status(200).json({ wishlist: data.items });
    }
    catch (err) {
        console.log(err);
        res.status(404).json(err.message);
    }
}

exports.deleteFromWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const userNumber = req.user.number;

        await Wishlist.updateOne(
            { user: userNumber },
            { $pull: { items: { product: productId } } }
        );

        const wishlist = await Wishlist.findOne({ user: userNumber }, 'items')

        res.status(200).json({ message: "Successfully deleted", wishlist: wishlist.items });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}