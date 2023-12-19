const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// app.use((req, res, next) => {
//     console.log('Request:', req.url);
//     next();
// });

app.use(express.static(path.join(__dirname, '../', 'Frontend', 'public')));
app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

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

const mongoConnection = require('./database/database');
const port = process.env.PORT;
mongoConnection()
    .then(() => {
        app.listen(port || 3000, () => {
            console.log('connected to Port:', port)
        });
    })
    .catch(err => console.log(err));