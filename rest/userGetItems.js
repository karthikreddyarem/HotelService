const config = require("../config/configurations");
const itemsSchema = require("../models/ItemsSchema");

// ReUsable Functionality
module.exports = async function getItems(req, res) {
  const items = await itemsSchema.find(
    { quantity: { $gt: 0 } },
    { _id: 1, name: 1, price: 1, description: 1 }
  );
  return res.json(items);
};
