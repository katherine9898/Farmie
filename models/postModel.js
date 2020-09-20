const mongoose = require('mongoose');

// Mongoose schema for a document of the post collection
const postSchema = new mongoose.Schema({
    products: {
        type: Array,
        items: {
            type: String
        },
        required: [true, 'A post must have at least a product']
    },
    quantity: {
        type: Number,
        required: [true, 'A post must have estimated quantity']
    },
    description: {
        type: String,
        required: [true, 'A post must have a description about product']
    },
    location: String,
    time: Date,
    userId: String,
    userName: String,
    userCountry: String,
    photo: {
        type: String,
        required: [true, 'A post must have an image of your fruits']
    }
});

const posts = mongoose.model('posts', postSchema);
module.exports = posts;