// Schema Design for the Items(Dishes) available for the application Users

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Items Schema that will be stored inside mongoDB
var ItemsSchema = new Schema({
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("Items", ItemsSchema);

// Exporting User Schema
module.exports = model;
