const express = require("express");
const router = express.Router();
const Category = require('../models/category');
const Cafeteria = require('../models/cafeteria');
const Rating = require('../models/rating');

router.get('/single', (req, res) => {
    const { name } = req.query;
    Category.aggregate([
        {
            '$match': {
                'name': name
            }
        },
        {
            '$unwind': '$menus'
        },
        {
            '$lookup': {
                'from': 'ratings',
                'localField': 'menus',
                'foreignField': 'menu',
                'as': 'ratings'
            }
        },
        {
            '$project': {
                'ratings': {
                    '$arrayElemAt': ['$ratings', 0]
                }
            }
        },
        {
            '$project': {
                'name': '$ratings.name',
                'menu': '$ratings.menu',
                'ratings': '$ratings.rating'
            }
        }
    ], (err, result) => {
        if (err) res.status(500).end('DB error');

        const processed = result.reduce((acc, cur) => {
            const key = cur.menu
            delete cur.menu

            acc[key] = {...cur}

            return acc
        }, {})

        res.send(processed)
    })
})

router.put('/restaurant', (req, res) => {
    console.log(req.body);
    const { name, rating } = req.body;

    Cafeteria.findOneAndUpdate(
        {
            'name': name
        },
        {
            '$push': {
                'rating': rating
            }
        },
        (err, result) => {
            if (err) res.status(500).end('DB error');

            res.sendStatus(200);
        }
    )
})

router.put('/menu', (req, res) => {
    console.log(req.body);
    const { name, menu, starPointsObj } = req.body;

    Rating.findOneAndUpdate(
        {
            'name': name,
            'menu': menu
        },
        {
            '$push': {
                'rating': starPointsObj
            }
        },
        (err, result) => {
            if (err) res.status(500).end('DB error');

            res.sendStatus(200);
        }
    )
})

module.exports = router;
