const express = require("express");
const router = express.Router();
const Category = require('../models/category');

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

        console.log(result);
        const processed = result.reduce((acc, cur) => {
            const key = cur.menu
            delete cur.menu

            acc[key] = {...cur}

            return acc
        }, {})

        res.send(processed)
    })
})

module.exports = router;
