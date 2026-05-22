const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();
  } catch (err) {
    res.status(400).json({
      error: "Invalid token",
    });
  }
};

module.exports = verifyToken;