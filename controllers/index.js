"use strict";

const express = require('express'),
    router = express.Router();

// normal routes ===============================================================
router.get('/', (req, res) => res.status(200).send({
    "message": "Please login first"
}));
router.use('/', require('./users'));
router.use('/', require('./badges'));

// secured routes ==============================================================
router.get('/api/profile', (req, res) => {
    let session = res.locals.session;
    res.status(200).send({
        "message": "This is data",
        id: session._doc._id
    });
});

module.exports = router;
