const mongoose = require("mongoose");

const buildingSchema = mongoose.Schema(
    {
        name: String,
        cafeteria_list: Array
    },
    {
        collection: "buildings"
    }
);

module.exports = mongoose.model("Building", buildingSchema);
