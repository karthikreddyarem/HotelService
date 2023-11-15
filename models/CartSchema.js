// Schema Design for the Cart(Dishes) available for the application Users

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema that will be stored inside mongoDB
var CartSchema = new Schema({
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("Cart", CartSchema);

// Exporting User Schema
module.exports = model;
