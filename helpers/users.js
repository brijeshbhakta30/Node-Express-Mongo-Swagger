"use strict";

// load up the user model
const User = require('../models/user');

// =========================================================================
// Authenticates a user ========================================================
// =========================================================================
let authenticate = (email, password, done) => {
    if (email)
        email = email.toLowerCase();
    process.nextTick(() => {
        User.findOne({
            'email': email
        }, (err, user) => {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, {
                    'loginMessage': 'No user found.'
                });

            if (!user.validPassword(password))
                return done(null, false, {
                    'loginMessage': 'Oops! Wrong password.'
                });

            else
                return done(null, user);
        });
    });
};

// =============================================================================
// Creates a new user ==========================================================
// =============================================================================
let createUser = (email, password, firstName, lastName, done) => {
    if (email)
        email = email.toLowerCase();

    process.nextTick(() => {
        User.findOne({
            'email': email
        }, (err, user) => {
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user)
                return done(null, false, {
                    'signupMessage': 'That email is already taken.'
                });

            else {
                // create the user
                let newUser = new User();

                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.firstName = firstName;
                newUser.lastName = lastName;

                newUser.save(err => {
                    if (err)
                        return done(err);

                    return done(null, newUser);
                });
            }

        });
    });
};

module.exports = {
    createUser,
    authenticate
};
