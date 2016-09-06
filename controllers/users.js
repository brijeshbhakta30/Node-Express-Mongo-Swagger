"use strict";

// load all the things we need
const express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    Users = require('../helpers/users');

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

router.post('/login', (req, res, next) => {

    if (!req.body.email)
        return res.status(409).send({
            'message': 'Please provide email.'
        });

    if (!req.body.password)
        return res.status(409).send({
            'message': 'Please provide password.'
        });

    Users.authenticate(req.body.email, req.body.password, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info);
        }

        //Creating a JWT token for user session which is valid for 24 hrs.
        let token = jwt.sign(user, process.env.APP_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        return res.status(200).send({
            token,
            user
        });
    });
});


// =============================================================================
// SIGNUP (USER REGISTRATION) ==================================================
// =============================================================================
router.post('/signup', (req, res, next) => {

    if (!req.body.email)
        return res.status(409).send({
            'message': 'Please provide email.'
        });

    if (!req.body.password)
        return res.status(409).send({
            'message': 'Please provide password.'
        });
    Users.createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info);
        }

        return res.status(200).send(user);
    });
});

module.exports = router;
