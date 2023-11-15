const config = require("../config/configurations");
const itemsSchema = require("../models/ItemsSchema");

// ReUsable Functionality
module.exports = {
  getItems: async function AdminGetItems(req, res) {
    const items = await itemsSchema.find(
      { quantity: { $gt: 0 } },
      { _id: 1, name: 1, price: 1, quantity: 1, description: 1 }
    );
    return res.json(items);
  },
  getAllItems: async function getAllItems(req, res) {
    const items = await itemsSchema.find(
      {},
      { _id: 1, name: 1, price: 1, quantity: 1, description: 1 }
    );
    return res.json(items);
  },
};
