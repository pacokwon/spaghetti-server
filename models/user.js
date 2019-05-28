const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dormitory: String,
    preference: {
        taste: {
            type: Number
        },
        portion: {
            type: Number
        },
        price: {
            type: Number
        }
    }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
