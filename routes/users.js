const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const axios = require('axios').default

const User = require('../models/users')
const Product = require('../models/products')
const Category = require('../models/categories')

const { isLoggedIn } = require('../functions/middleware')

// Register Route
router.get('/registerUser', catchAsync(async(req, res) => {
    const categories = await Category.find({})
    res.render('users/registerUser', { categories })
}))

// Login Route
router.get('/login', catchAsync(async(req, res) => {
    const categories = await Category.find({})
    res.render('users/login', { categories })
}))

// Posts, Puts, Deletes

// Register User
router.post('/newUser', catchAsync(async (req, res, next) => {
    const { username, password, age } = req.body;
    const user = new User({ username, age });
    const newUser = await User.register(user, password)
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Zamazon');
        res.redirect('/z');
    })
}))

// Logout
router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'goodbye!')
    res.redirect('/z')
})

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    try {
        req.flash('success', 'welcome back')
        const redirectUrl = req.session.returnTo || '/z'
        console.log(req.session)
        delete req.session.returnTo
        console.log(req.session)
        res.redirect(redirectUrl)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('login')
    }
})

// Adds To Cart
router.put('/addToCart/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const product = await Product.findById(id);
    await currentUser.cart.push(product)
    currentUser.save()
    res.redirect('back')
}))

// Removes from Cart
router.put('/removeFromCart/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const product = await Product.findById(id);
    await currentUser.cart.splice(currentUser.cart.indexOf(product._id) , 1)
    currentUser.save()
    res.redirect('back')
}))

module.exports = router;