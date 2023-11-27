const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Items Schema that will be stored inside mongoDB
var OrderSchema = new Schema({
  userid: {
    type: String,
  },
  productids: [
    {
      productid: {
        type: Number,
      },
      name: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  total_bill: {
    type: Number,
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("Orders", OrderSchema);

// Exporting User Schema
module.exports = model;
