const mongoose = require('mongoose');

// Mongoose schema for a document of the fruit collection
const fruitSchema = new mongoose.Schema({
    name: String,
    postId: {
        type: Array,
        items: {
            type: String
        },
        default: []
    }
});

const fruits = mongoose.model('fruits', fruitSchema);
module.exports = fruits;