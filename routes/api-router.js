const express = require("express");
const router = express.Router();
const restaurant = require('./restaurant-router');
const user = require('./user-router')
const rating = require('./rating-router');

router.use('/restaurant', restaurant);
router.use('/user', user);
router.use('/rating', rating);

module.exports = router;
