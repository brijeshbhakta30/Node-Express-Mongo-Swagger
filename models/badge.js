"use strict";
// load the things we need
const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
/* ID, position, name, expires date and photo*/
// define the schema for our user model
const badgeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    position: {
        type: String,
        required: true
    },
    expiresOn: {
        type: Date,
        required: true
    },
    photoURL: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

// Checking if Badge is valid
badgeSchema.methods.isValid = function() {
    return (new Date()) <= new Date(this.expiresOn);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Badge', badgeSchema);
