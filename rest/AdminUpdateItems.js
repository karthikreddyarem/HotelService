const config = require("../config/configurations");
const itemsSchema = require("../models/ItemsSchema");

// ReUsable Functionality
module.exports = async function adminUpdateItems(req, res) {
  const { id, quantity, price, description } = req.body[0];

  const isValidItem = await itemsSchema.findByIdAndUpdate(id, {
    quantity: Number(quantity),
    price: Number(price),
    description: description,
  });
  return res.json(isValidItem);
};
