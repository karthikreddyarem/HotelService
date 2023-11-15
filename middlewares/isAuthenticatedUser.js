const jwt = require("jsonwebtoken");
const config = require("../config/configurations");

module.exports = function isAuthenticated(req, res, next) {
  const token = req.cookies[config.COOKIEKEY];
  jwt.verify(token, config.SECRETKEY, (err, user) => {
    if (err) {
      return res.json({ message: err });
    } else {
      req.user = user;
      next();
    }
  });
};
