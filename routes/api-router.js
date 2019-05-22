const express = require("express");
const router = express.Router();
const Distance = require('../models/Distance');

/**
 * db.distances.aggregate([ {$match: {start: '카이스트본원소망관'}}, { $lookup: { from: 'places', localField: 'destination', foreignField: 'name', as: 'place_info'}}, {$unwind: '$place_info'}, { $project: { _id: 1, start: 1, destination: 1, distance: 1, cafeteria_list: '$place_info.cafeteria_list'} }])
 */
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
            '$sort': { 'distance': 1 }
        },
        {
            '$lookup': {
                'from': "places",
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
        console.log(result);
        res.send(JSON.stringify(result));
    })
})

module.exports = router