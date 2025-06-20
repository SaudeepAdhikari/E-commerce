const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    stock: Number,
    reviews: [
        {
            rating: { type: Number, required: true, min: 1, max: 5 },
            author: { type: String, required: true },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Product', productSchema); 