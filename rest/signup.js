const config = require("../config/configurations");
const userSchema = require("../models/UserSchema");

// ReUsable Functionality
module.exports = async function signup(req, res) {
  const { username, email, password } = req.body;

  if (
    !email.endsWith("@gmail.com") ||
    !username ||
    !password ||
    !email ||
    password.length < 5 ||
    username.length < 4 ||
    email.length < 14
  ) {
    return res.redirect("/signup");
  }

  const isUserUnqiue = await userSchema.model.findOne({ email });
  if (isUserUnqiue) {
    return res.json({
      message:
        "User has already registered with the email. Please use Signin option.",
    });
  } else {
    userSchema.model.create({
      username,
      email,
      password,
      userRole: config.APPUSER,
    });
    return res.redirect("/signin");
  }
};
