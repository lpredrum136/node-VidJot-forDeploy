const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// USER LOGIN ROUTE
router.get('/login', (req, res) => {
    res.render('users/login');
});

// USER LOGIN POST ROUTE WITH FORM
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {// The strategy 'local' will be defined in config/passport.js
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); // WTF is this? Immediate fire off this, no need to wait for res I guess?
});

// USER LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// USER REGISTER ROUTE
router.get('/register', (req, res) => {
    res.render('users/register');
});

// USER REGISTER (POST) ROUTE WITH FORM
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }

    if (req.body.password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });

    } else {
        // Check if email exists already
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            new User(newUser)
                                .save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
            
                }
            });

    }
});

module.exports = router;