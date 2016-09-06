"use strict";

// load up the badge model
const BadgeModel = require('../models/badge');

// =============================================================================
// Creates a new badge =========================================================
// =============================================================================
let createBadge = (name, position, expiresOn, photoURL, done) => {
    if (name)
        name = name.toLowerCase(); // To avoid case sensitivity of badge name

    process.nextTick(() => {
        BadgeModel.findOneAndUpdate({
            'name': name
        }, {
            name,
            position,
            expiresOn,
            photoURL,
            isActive: new Date() <= new Date(expiresOn),
            createdOn: new Date()
        }, {
            upsert: true,
            new: true
        }, (err, badge) => {
            if (err)
                return done(err);

            return done(null, badge);
        });
    });
};

// =============================================================================
// Retrives all the valid badges ===============================================
// =============================================================================
let getBadges = (done) => {
    validateBadges(); // Validates badges

    let query = BadgeModel.find({
        isActive: true
    });
    query.sort({
        name: 'asc'
    });

    process.nextTick(() => {
        query.exec((err, badges) => {
            if (err)
                done(err);
            else {
                if (badges.length) {
                    badges.map(function(item, index) {
                        item.photoURL = process.env.BADGE_IMAGE_PATH_URL + item.photoURL;
                        return;
                    });

                    done(badges);
                } else
                    done({
                        message: 'No valid badge is available'
                    });
            }
        });
    });
};

// =============================================================================
// Validates all the bdages into the database ==================================
// =============================================================================
let validateBadges = () => {
    let query = {
        isActive: true,
        expiresOn: {
            $lt: new Date()
        }
    };
    BadgeModel.update(query, {
        isActive: false
    }, {
        multi: true
    }, (err, rawResponse) => {});
};

module.exports = {
    createBadge,
    getBadges
};
