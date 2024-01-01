const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.stripeGateway = async (amount, products) => {
    try {
        return new Promise(async (resolve, reject) => {

            const lineItems = products.map(product => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.productId.name
                    },
                    unit_amount: product.productId.price * 100
                },
                quantity: product.quantity
            }))

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.API_URL}/ordersPage/order.html?success=${true}`,
                cancel_url: `${process.env.API_URL}/ordersPage/order.html?success=${false}`,
            })
            resolve(session.id);
        })
    }
    catch (err) {
        console.log(err);
    }
}