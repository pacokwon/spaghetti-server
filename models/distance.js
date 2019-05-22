const mongoose = require("mongoose");

const distanceSchema = mongoose.Schema(
  {
    start: String,
    destination: String,
    distance: Number,
  },
  {
    collection: "distances"
  }
);

module.exports = mongoose.model("Distance", distanceSchema);
