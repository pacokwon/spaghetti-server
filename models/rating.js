const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    name: String,
    rating: [{
        taste: Number,
        portion: Number,
        price: Number
    }]
}, {
    collection: 'ratings'
});

module.exports = mongoose.model('Rating', ratingSchema);
