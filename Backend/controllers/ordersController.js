const Order = require('../models/Order');

exports.orderCheckout = async (req, res) => {
    try {
        const { productDetails, total } = req.body;
        const userNumber = req.user.number;

        const user = await Order.findOne({ user: userNumber, status: 'Pending' });

        if (user) {
            await Order.findOneAndUpdate({ user: userNumber, status: 'Pending' }, {
                products: productDetails,
                totalAmount: total
            })
        }
        else {
            const checkoutData = new Order({
                user: userNumber,
                products: productDetails,
                totalAmount: total
            })
            await checkoutData.save();
        }

        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
    }
}

exports.getCheckout = async (req, res) => {
    try {
        const userNumber = req.user.number;

        const checkoutData = await Order.findOne({ user: userNumber, status: 'Pending' }, 'products totalAmount')
            .populate('products.productId');

        res.status(200).json(checkoutData);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getOrders = async (req, res) => {
    try {
        const userNumber = req.user.number;

        const orderData = await Order.find({ user: userNumber }, 'products totalAmount status createdAt')
            .populate('products.productId')
            .sort({createdAt: -1});

        res.status(200).json({ orderData: orderData });
    }
    catch (err) {
        console.log(err);
    }
}