const mongoose = require("mongoose");

const cafeteriaSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        rating: [Number]
    },
    {
        collection: "cafeterias"
    }
);

module.exports = mongoose.model("Cafeteria", cafeteriaSchema);
