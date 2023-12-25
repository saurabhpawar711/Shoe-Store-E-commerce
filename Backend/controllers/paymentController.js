const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { stripeGateway } = require('../services/gatewayService');

const removeFromCart = async (number) => {
    try {
        await Cart.findOneAndUpdate({ user: number }, { items: [] });
        return;
    }
    catch (err) {
        console.log(err);
    }
}

exports.paymentGatewayProcess = async (req, res) => {
    try {
        const userNumber = req.user.number;
        const { name, address } = req.body;
        const order = await Order.findOne({ user: userNumber, status: 'Pending' }, 'totalAmount products')
            .populate('products.productId');

        const updateStatus = await Order.findOneAndUpdate({ user: userNumber, status: 'Pending' },
            {
                paymentMethod: 'Credit/Debit Card',
                customerName: name,
                address: address,
            }
        )

        await Promise.all([order, updateStatus]);
        const id = await stripeGateway(order.totalAmount, order.products);

        res.status(200).json({ id: id, message: 'Your Order will be delivered soon' });
    }
    catch (err) {
        console.log(err);
    }
}

exports.paymentConfirm = async (req, res) => {
    const status = req.body.status;
    const userNumber = req.user.number;
    try {
        await Order.findOneAndUpdate({ user: userNumber, status: 'Pending', paymentMethod: 'Credit/Debit Card' },
            {
                status: status
            }
        )
        removeFromCart(userNumber);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
    }
}

exports.paymentCod = async (req, res) => {
    try {
        const userNumber = req.user.number;
        const { name, address } = req.body;

        await Order.findOneAndUpdate({ user: userNumber, status: 'Pending' },
            {
                paymentMethod: 'Cash on Delivery',
                customerName: name,
                address: address,
                status: 'Processing'
            }
        )
        removeFromCart(userNumber);
        res.status(200).json({ message: 'Your Order will be delivered soon' });
    }
    catch (err) {
        console.log(err);
    }
}