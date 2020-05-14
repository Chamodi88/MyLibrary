const express = require('express')
const router = express.Router()
const bcrpt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/user')

const ROLE = { ADMIN: 'admin', BASIC: 'basic' }

// Login route
router.get('/login', (req, res) => {
    res.render('login')
})

// Login handle
router.post('/login', (req,res, next, user) => {
        passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next)
    console.log(user.role)
})

// logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are looged out')
    res.redirect('/users/login')
})

// Register route
router.get('/register', (req, res) => {
    res.render('register')
})

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    
    let errors = [];

// Check required fields
if (!name || !email || !password || !password2 ) {
    errors.push({ msg: ' Please fill in all fields'});
}

 // chech password match
if ( password !== password2) {
    errors.push({ msg: 'Passwords do not match'});
}

// check password length
if (password.length < 6) {
    errors.push({ msg: 'password should be at least 6 characters'})
}

if (errors.length >0 ) {
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2
    });
} else {
    // validation passed
    User.findOne({ email: email}).then(user => {
        if (user) {
            errors.push({ msg: 'Email is already registered'})
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } if (req.body.name == 'admin') {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    role: ROLE.ADMIN
                });
            bcrpt.genSalt(10, (err, salt) => bcrpt.hash(newUser.password, salt, (err, hash) =>{
                if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then( user => {
                        req.flash('success_msg', 'You are now registered and can log in')
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            }))
        }

        else {
            const newUser = new User({
                name: name,
                email: email,
                password: password
            });
        bcrpt.genSalt(10, (err, salt) => bcrpt.hash(newUser.password, salt, (err, hash) =>{
            if (err) throw err;
                newUser.password = hash;
                newUser.save()
                .then( user => {
                    req.flash('success_msg', 'You are now registered and can log in')
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
        }))
    }




    });
}
});

module.exports = router;

