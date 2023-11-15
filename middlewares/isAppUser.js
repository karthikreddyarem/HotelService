module.exports = async function isAppUser(req, res, next) {
  if (req.user.userRole) {
    return res.json({ message: "U do not have enough permisssions." });
  } else {
    next();
  }
};
