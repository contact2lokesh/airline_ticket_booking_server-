const jwt = require("jsonwebtoken");
const pool = require("../db");

const jwtAdminAuthorization = async (req, res, next) => {
  try {
    // Get token from header
    // token(key) : jwtToken(value)
    const jwtToken = req.header("token");

    // Check if no token
    if (!jwtToken) {
      res.status(403).json({ message: "No Token, Not Authorize." });
    } else {
      // Verify token
      const verify = jwt.verify(jwtToken, process.env.jwtSecret);

      const isValidAdmin = await pool.query("SELECT * FROM admin WHERE admin_id  = $1", [verify.user]);

      if (!isValidAdmin.rows[0]) {

        res.status(401).json({ message: "The provided authorization token is not a valid Admin." });

      } else {
        req.user = verify.user;
        next();

      }
    }

  } catch (error) {

    res.status(403).json({ message: "Not Authorize." });

  }
}

const jwtUserAuthorization = async (req, res, next) => {
  try {
    // Get token from header
    // token(key) : jwtToken(value)
    const jwtToken = req.header("token");

    // Check if no token
    if (!jwtToken) {
      res.status(403).json({ message: "No Token, Not Authorize." });
    } else {
      // Verify token
      const verify = jwt.verify(jwtToken, process.env.jwtSecret);

      const isValidUser = await pool.query("SELECT * FROM users WHERE user_id  = $1", [verify.user]);

      if (!isValidUser.rows[0]) {

        res.status(401).json({ message: "The provided authorization token is not a valid user." });

      } else {
        req.user = verify.user;
        next();

      }
    }

  } catch (error) {

    res.status(403).json({ message: "Not Authorize." });

  }
}


module.exports = {jwtAdminAuthorization, jwtUserAuthorization};