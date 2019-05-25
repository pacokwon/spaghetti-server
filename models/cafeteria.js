const mongoose = require("mongoose");

const cafeteriaSchema = mongoose.Schema(
    {
        name: String,
        description: String
    },
    {
        collection: "cafeterias"
    }
);

module.exports = mongoose.model("Cafeteria", cafeteriaSchema);
