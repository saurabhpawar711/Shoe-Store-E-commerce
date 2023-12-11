const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

// app.use(json());
app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

const userRoutes = require('./routes/userRoute');

app.use('/auth', userRoutes);

const mongoConnection = require('./database/database');
const port = process.env.PORT;
mongoConnection()
    .then(() => {
        app.listen(port || 3000, () => {
            console.log('connected to Port: ', port)
        })
    })
    .catch(err => console.log(err));