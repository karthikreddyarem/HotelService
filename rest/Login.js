const jwt = require("jsonwebtoken");
const userSchema = require("../models/UserSchema");
const config = require("../config/configurations");

// ReUsable Functionality
module.exports = async function login(req, res) {
  const { email, password, userRole } = req.body;
  const userType = userRole === "Admin" ? true : false;
  const user = await userSchema.model.findOne({ email });
  if (!user) {    
    return res.redirect("/signup");
  } else {
    if (password !== user.password || userType !== user.userRole) {
      return res.status(400);
    }

    const payload = {
      userId: user._id,
      username: user.username,
      email,
      userRole: user.userRole,
    };
    jwt.sign(payload, config.SECRETKEY, (err, token) => {
      if (err) console.log(err);
      res.cookie("token", token);
      if (user.userRole) {
        return res.redirect("/admin/homePage");
      }
      return res.redirect("/homePage");
    });
  }
};
