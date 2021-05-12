const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = new Schema({
    categoryImg: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    categoryDescription: {
        type: String,
        requied: true,
    },
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
})

const Category = mongoose.model('Category', categories)

module.exports = Category;