const mongoose = require('mongoose');
const Category = require('./categories');
const Schema = mongoose.Schema;

const products = new Schema({
    productImgs: [
        {
            type: String
        }
    ],
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
})

products.post('findOneAndDelete', async function (product) {
    try {
        console.log('meow')
        console.log(product)
        console.log('meow')
        const category = await Category.findById(`${product.productCategory}`)
        console.log(product._id)
        category.products.splice(category.products.indexOf(product._id))
        category.save()
    } catch (e) {
        console.log(e)
    }
})

const Product = mongoose.model('Product', products)

module.exports = Product;   