const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const axios = require('axios').default
const Product = require('../models/products')
const Category = require('../models/categories')

const { isLoggedIn } = require('../functions/middleware')

// product page
router.get('/product/:id', catchAsync(async(req, res) => {
    req.session.returnTo = req.originalUrl
    const { id } = req.params
    const categories = await Category.find({})
    const product = await Product.findById(id).populate('productCategory')
    res.render('products/product', { product, categories }) 
}))

// all products page
router.get('/products', catchAsync(async(req, res) => {
    req.session.returnTo = req.originalUrl
    const categories = await Category.find({}).populate('products')
    const products = await Product.find({}).populate('productCategory')
    res.render('products/products', { products, categories })
}))

// Create Product
router.get('/createProduct', catchAsync(async(req, res) => {
    req.session.returnTo = req.originalUrl
    const categories = await Category.find({})
    res.render('products/createProduct', { categories })
}))

// Update Product
router.get('/product/:id/update', catchAsync(async (req, res) => {
    req.session.returnTo = req.originalUrl
    const { id } = req.params;
    const categories = await Category.find({})
    const product = await Product.findById(id)
    res.render('products/updateProduct', { product, categories })
}))

// Posts, Puts, Deletes

// Creates Product
router.post('/createProduct', catchAsync(async (req, res) => {
    const { productImg, productName, productDescription, productPrice, productCategory } = req.body
    const product = new Product({ productName, productDescription, productPrice});
    const category = await Category.findById(productCategory)
    product.productCategory = category
    await category.products.push(product)
    await product.productImgs.push(productImg)
    await product.save()
    await category.save()
    res.redirect('/products')
}))

// Updates Products
router.put('/product/:id/update', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/product/${id}`)
}))

// Delete Product
router.delete('/product/:id/delete', catchAsync(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id)
    res.redirect('/products')
}))

module.exports = router;