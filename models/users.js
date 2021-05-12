const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    username: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: true
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
})

users.plugin(passportLocalMongoose)

const User = mongoose.model('User', users)

module.exports = User;