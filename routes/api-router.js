const express = require("express");
const router = express.Router();
const Distance = require('../models/distance');
const Category = require('../models/category');
const Building = require('../models/building');

/**
 * db.distances.aggregate([ {$match: {start: '카이스트본원소망관'}}, { $lookup: { from: 'places', localField: 'destination', foreignField: 'name', as: 'place_info'}}, {$unwind: '$place_info'}, { $project: { _id: 1, start: 1, destination: 1, distance: 1, cafeteria_list: '$place_info.cafeteria_list'} }])
 */
router.get('/nearbyRestaurants', (req, res) => {
    const { start } = req.query;
    const closest_N = Number(req.query.closest_N);

    Distance.aggregate([
        {
            '$match': {
                'start': start,
            }
        },
        {
            '$sort': { 'distance': 1 }
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
                '_id': 1,
                'start': 1,
                'destination': 1,
                'distance': 1,
                'cafeteria_list': '$place_info.cafeteria_list'
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

router.get('/allRestaurants', (req, res) => {
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



module.exports = router
