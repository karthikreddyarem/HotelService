const config = require("../config/configurations");
const itemsSchema = require("../models/ItemsSchema");

// ReUsable Functionality
module.exports = async function deleteItems(req, res) {
  const { id } = req.body[0];
  console.log(id);
  const isvalidItem = await itemsSchema.deleteOne({ _id: id });
  if (!isvalidItem) {
    return res.json({
      message: "Cannot Delete unknown dishes. Please verify Dish Id",
    });
  }
  return res.json({
    message: "Successfully deleted the Dishes",
  });
};
