const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dormitory: String
});

module.exports = mongoose.model('User', userSchema);