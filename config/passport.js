const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
require('../models/User');
const User = mongoose.model('users');

// We have to export a function that has our strategy
module.exports = passport => {//passed in the instance of passport. It will be passed in from app.js
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {//email and password here are the things they put in the login form
        //console.log(email);// If you see the email in the console, it means the login form is connected to the strategy
        //console.log(password);// Similar to above

        // Match user email
        User.findOne({
            email: email
        })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No user found' });// done function is above, take in an error as 1st parameter, 2nd parameter is the user, which there is none
                    // in this case, so we return false. 3rd parameter is a message to be sent, inside an object {}
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);// return the user
                    } else {
                        return done(null, false, { message: 'Password incorrect' });// don't want to return the user because it doesn't match
                    }
                });
            });
    }));// Normally no need for usernameField if you have a username, but in this case we use email so 
    // we have to specify that we are using email as our username
    // (email, password, done) means after finishing authentication, we need to call back the done function

    // Session, http://www.passportjs.org/docs/downloads/html/ at Sessions section
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {// findById luckily is a mongoose function. If you use other ORM, need to change that
            done(err, user);
        });
    });
};