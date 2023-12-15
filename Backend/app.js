const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

const userRoutes = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoutes');
const wishlistRoute = require('./routes/wishlistRoute');

app.use('/auth', userRoutes);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/wishlist', wishlistRoute);

const mongoConnection = require('./database/database');
const port = process.env.PORT;
mongoConnection()
    .then(() => {
        app.listen(port || 3000, () => {
            console.log('connected to Port: ',port)
        });
    })
    .catch(err => console.log(err));