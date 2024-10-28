const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt_social) {
      token = req.cookies.jwt_social;
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! . please login to get access",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
