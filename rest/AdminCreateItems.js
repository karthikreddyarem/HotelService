const config = require("../config/configurations");
const itemsSchema = require("../models/ItemsSchema");

// ReUsable Functionality
module.exports = async function createItems(req, res) {
  const { name, quantity, price, description } = req.body[0];

  if (!name || !quantity || !price || !description) {
    res.redirect("/admin/homePage");
  }

  if (Number(price) < 1 || Number(quantity) < 0) {
    res.redirect("/admin/homePage");
  }
  itemsSchema.create({
    name,
    quantity,
    price,
    description,
  });
  return res.status(200).json({ message: "persisted new Items" });
};
