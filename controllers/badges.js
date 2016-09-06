"use strict";

// load all the things we need
const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    Badges = require('../helpers/badges');

// =============================================================================
// BADGES (RETRIVE BADGES INFORMATION) =========================================
// =============================================================================
router.get('/badges', (req, res) => Badges.getBadges((result) => res.status(200).send(result)));

let storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, './public/images/badges/');
    },
    filename: (req, file, done) => {
        console.log(`File:`, file);
        done(null, (req.body.name || Date.now()) + path.extname(file.originalname)); //Appending extensiom
    }
});

let upload = multer({
    storage: storage
});

// =============================================================================
// BADGES (BADGE REGISTRATION) =================================================
// =============================================================================
router.post('/badges', upload.single('image'), (req, res) => {

    if (!req.body.name)
        return res.status(409).send({
            'message': 'Please provide badge name.'
        });

    if (!req.body.position)
        return res.status(409).send({
            'message': 'Please provide badge position.'
        });

    if (!req.body.expiresOn)
        return res.status(409).send({
            'message': 'Please provide badge expiry date.'
        });
    else if (!((new Date(req.body.expiresOn)).toString().localeCompare("Invalid Date"))) {
        return res.status(409).send({
            'message': 'Please provide valid badge expiry date in mm-dd-yy format.'
        });
    }

    if (!req.file)
        return res.status(409).send({
            'mesage': 'Please provide badge photo'
        });

    Badges.createBadge(req.body.name, req.body.position, req.body.expiresOn, req.file.filename, (err, badge) => {
        if (err)
            return res.status(500).send({
                'error': err
            });
        return res.status(200).send(badge);
    });
});

module.exports = router;
