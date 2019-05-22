const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dormitory: String
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);