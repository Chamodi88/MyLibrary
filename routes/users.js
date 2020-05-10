const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrpt = require('bcryptjs')

// Login route
router.get('/login', (req, res) => {
    res.render('login')
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
        } else {
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
                        console.log(newUser)
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            }))
        }
    });
}
});

module.exports = router;

