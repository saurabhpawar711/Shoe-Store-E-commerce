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
        const status = req.query.status;
        let orderData;

        if (status && status !== 'All') {
            orderData = await Order.find({ user: userNumber, status: status }, 'products totalAmount status createdAt')
                .populate('products.productId')
                .sort({ createdAt: -1 });
        }
        else {
            orderData = await Order.find({ user: userNumber, status: { $ne: 'Pending' } }, 'products totalAmount status createdAt')
                .populate('products.productId')
                .sort({ createdAt: -1 });
        }

        if (orderData.length === 0) {
            throw new Error('No order list');
        }

        res.status(200).json({ orderData: orderData });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
}

exports.cancelOrder = async (req, res) => {
    const userNumber = req.user.number;
    const orderId = req.body.orderId;
    try {
        const orderData = await Order.findOneAndUpdate({ user: userNumber, _id: orderId, status: { $ne: 'Pending Cancelled' } },
            {
                $set: { status: 'Cancelled' }
            },
            {
                new: true,
                projection: 'products totalAmount status createdAt',
                populate: { path: 'products.productId' },
                sort: { createdAt: -1 }
            })

        res.status(200).json({ orderData: orderData });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong while cancelling order' });
    }
}