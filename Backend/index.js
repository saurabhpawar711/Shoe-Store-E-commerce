
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const serverless = require('serverless-http');
const mongoConnection = require('./database/database');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,PUT,PATCH,POST,DELETE,OPTION"
}));
app.use(compression());

app.use(express.static(path.join(__dirname, '../', 'Frontend', 'public')));

const userRoutes = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoutes');
const wishlistRoute = require('./routes/wishlistRoute');
const ordersRoute = require('./routes/orderRoute');
const paymentRoute = require('./routes/paymentRoute');

app.use('/auth', userRoutes);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/wishlist', wishlistRoute);
app.use('/order', ordersRoute);
app.use('/payment', paymentRoute);


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'Frontend', 'public', 'homePage', 'index.html'));
});

(async function () {
    await mongoConnection();
})();

module.exports.handler = serverless(app);
