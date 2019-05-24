const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        name: String,
        category: String,
        menus: Array,
    },
    {
        collection: "categories"
    }
);

module.exports = mongoose.model("Category", categorySchema);
