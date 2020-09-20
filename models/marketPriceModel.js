const mongoose = require('mongoose');

// Mongoose schema for a document of the market price collection
const marketPriceSchema = new mongoose.Schema({
    _id: String,
    date: Date,
    prices: [{
        name: String,
        price: {
            type: Array,
            items: {
                type: String
            }
        }
    }]
});

const marketPrice = mongoose.model('marketPrice', marketPriceSchema);
module.exports = marketPrice;