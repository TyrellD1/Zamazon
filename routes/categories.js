const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const axios = require('axios').default
const Category = require('../models/categories')

const { isLoggedIn } = require('../functions/middleware')

// Home Page
router.get('/z', catchAsync(async(req, res) => {
    const categories = await Category.find({})
    res.render('categories/home', { categories })
}))

// Category Page
router.get('/category/:id', catchAsync(async(req, res) => {
    req.session.returnTo = req.originalUrl
    console.log(req.session)
    const { id } = req.params
    const categories = await Category.find({})
    const category = await Category.findById(id).populate('products')
    res.render('categories/category', { category, categories })
}))

// all Categories
router.get('/categories', catchAsync(async(req, res) => {
    req.session.returnTo = req.originalUrl
    const categories = await Category.find({})
    res.render('categories/categories', { categories })
}))

// Create Category
router.get('/createCategory', isLoggedIn, catchAsync(async(req, res) => {
    const categories = await Category.find({})
    res.render('categories/createCategory', { categories })
}))

// Update Category
router.get('/category/:id/update', catchAsync(async (req, res) => {
    const { id } = req.params;
    const categories = await Category.find({})
    const category = await Category.findById(id)
    res.render('categories/updateCategory', { category, categories })
}))

// Posts, Puts, Deletes

// Create Category
router.post('/newCategory', catchAsync(async(req, res) => {
    const { categoryImg, categoryName, categoryDescription } = req.body;
    const category = new Category({ categoryImg, categoryName, categoryDescription })
    await category.save()
    res.redirect('/categories')
}))

// Update Category
router.put('/category/:id/update', catchAsync(async(req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { runValidators: true})
    res.redirect(`back`)
}))

// Delete Category
router.delete('/category/:id/delete', catchAsync(async(req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id)
    res.redirect('categories')
}))

// Error Handler
router.get('/error', (req, res) => {
    res.render('error')
})


module.exports = router;