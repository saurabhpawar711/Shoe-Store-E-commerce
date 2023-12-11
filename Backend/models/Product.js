const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    gender: String,
    category: String,
    price: Number,
    is_in_inventory: Boolean,
    items_left: Number,
    imageURL: String,
    slug: String,
})

const Product = mongoose.model('Product', productSchema);

 module.exports = Product;