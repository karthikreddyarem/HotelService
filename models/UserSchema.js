// Schema Design for the applications Users

const cloudDbUrl = "mongodb+srv://endukuchepala:K@rthik01@credentials.efbelld.mongodb.net/?retryWrites=true&w=majority";
const localDburl = "mongodb://localhost/Credentials";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema that will be stored inside mongoDB
var UserSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  userRole: {
    type: Boolean,
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("User", UserSchema);

const dbConnection = async () => {
  await mongoose.connect("mongodb://localhost/Credentials");
  console.log("DB connection Established.");
};

// Exporting User Schema
module.exports = { dbConnection, model };
