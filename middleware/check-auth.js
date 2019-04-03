require("dotenv").config();

const jwt = require("jsonwebtoken");
const user_controller = require("../controllers/user")

module.exports = (req, res, next) => {
  try {
    console.log("@@@@")
    // const out = user_controller.token;
    // console.log(out)

    const token = user_controller.token;
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWTKEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed!"
    });
  }
};
