const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const {ensureAuthenticated} = require('../config/auth')

router.get('/', async (req,res) => {
    let books
    try {
        books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
    } catch {
        books =[]
        
    }
    res.render('index', {books : books})
})

router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    let books
    try {
        books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
    } catch {
        books =[]
        
    }
    res.render('dashboard',{books : books, name: req.user.name})
})
module.exports = router