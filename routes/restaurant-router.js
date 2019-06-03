const express = require("express");
const router = express.Router();
const Building = require('../models/building');
const Distance = require('../models/distance');
const Cafeteria = require('../models/cafeteria');

// get nearby restaurant from a certain dormitory
router.get('/nearby', (req, res) => {
    const { start } = req.query;
    const closest_N = Number(req.query.closest_N);

    Distance.aggregate([
        {
            '$match': {
                'start': start,
            }
        },
        {
            '$lookup': {
                'from': "buildings",
                'localField': "destination",
                'foreignField': "name",
                'as': "place_info"
            }
        },
        {
            '$unwind': '$place_info'
        },
        {
            '$project': {
                'start': 1,
                'destination': 1,
                'distance': 1,
                'cafeteria_list': '$place_info.cafeteria_list'
            }
        },
        {
            '$unwind': '$cafeteria_list'
        },
        {
            '$lookup': {
                'from': 'cafeterias',
                'localField': 'cafeteria_list',
                'foreignField': 'name',
                'as': 'ratings'
            }
        },
        {
            '$project': {
                'start': 1,
                'destination': 1,
                'distance': 1,
                'cafeteria': '$cafeteria_list',
                'ratings': { '$arrayElemAt': ['$ratings.rating', 0] }
            }
        },
        {
            '$group': {
                '_id': {
                    'distance': '$distance',
                    'destination': '$destination'
                },
                'cafeteria_list': {
                    '$push': {
                        'cafeteria': '$cafeteria',
                        'ratings': '$ratings'
                    }
                }
            }
        },
        {
            '$sort': {
                '_id.distance': 1
            }
        },
        {
            '$limit': closest_N
        }
    ], (err, result) => {
        if (err) res.status(500).end('DB error');

        res.status(200);
        res.send(JSON.stringify(result));
    })
})

// get all restaurant information
router.get('/all', (req, res) => {
    Building.aggregate([
        {
            '$unwind': '$cafeteria_list'
        },
        {
            '$lookup': {
                'from': 'cafeterias',
                'localField': 'cafeteria_list',
                'foreignField': 'name',
                'as': 'caft_info'
            }
        },
        {
            '$project': {
                '_id': 1,
                'building_name': '$name',
                'caft_name': '$cafeteria_list',
                'description': '$caft_info.description'
            }
        }
    ], (err, result) => {
        if (err) res.status(500).end('DB error');

        res.send(JSON.stringify(result));
    })
})

// get single restaurant information
router.get('/single', (req, res) => {
    const { name } = req.query;

    Cafeteria.aggregate([
        {
            '$match': {
                'name': name
            }
        },
        {
            '$lookup': {
                'from': 'categories',
                'localField': 'name',
                'foreignField': 'name',
                'as': 'categories'
            }
        },
        {
            '$project': {
                'name': 1,
                'description': 1,
                'rating': 1,
                'categories.category': 1,
                'categories.menus': 1
            }
        }
    ], (err, result) => {
        if (err) res.status(500).end('DB error');

        res.send(JSON.stringify(result));
    })
})

module.exports = router