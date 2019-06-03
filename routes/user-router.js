const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkToken = require("./authentication");

const router = express.Router();

// get user data
router.get('/data', checkToken, (req, res) => {
    const { username } = req.query;
    User.find({ username }, (err, users) => {
        if (err) console.log(err);

        const { name, dormitory, preference } = users[0];

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            username,
            name,
            dormitory,
            preference
        }));
    })
})

// checks if user exists
router.get('/check', (req, res) => {
    const { username } = req.query;
    User.find({ username }, (err, users) => {
        if (err) console.log(err);

        res.setHeader("Content-Type", "application/json");
        if (users.length) {
            // if such username exists, set exists to true
            res.send(JSON.stringify({ exists: true }));
        } else {
            // if such username doesn't exist set exists to false
            res.send(JSON.stringify({ exists: false }));
        }
    });
})


// registers user data
router.post('/register', (req, res) => {
    const { name, username, password, dormitory, preference } = req.body;

    const user = new User({
        name,
        username,
        password,
        dormitory,
        preference
    });

    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
            console.log(error);
        }
        // update password to hashed one
        user.password = hash;

        // save to database
        user.save((err) => {
            if (err) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            console.log('user registration successful');

            res.json({
                success: true
            });
        });
    });
})

// find user from login information
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.find({ username }, (err, user) => {
        if (!user.length) {
            return res.json({
                success: false,
                token: null
            });
        }
        bcrypt.compare(password, user[0]['password'], (error, result) => {
            if (result) {
                const token = jwt.sign({ username }, 'keyboard cat', { expiresIn: 3600 });
                res.json({
                    success: true,
                    token
                });
            } else {
                res.json({
                    success: false,
                    token: null
                })
            }
        })
    })
})

// modify user dormitory or preference
router.put('/modify', checkToken, (req, res) => {
    const { username, preference, selectedDorm } = req.body;

    User.findOneAndUpdate(
        {
            'username': username
        },
        {
            'preference': preference,
            'dormitory': selectedDorm
        },
        (err, result) => {
            const message = err ? 'DB error' : "Changes Successfully Made";

            res.send({ message });
        }
    )
})

module.exports = router;
