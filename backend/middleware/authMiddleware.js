const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    console.log("Middleware Error:", err.message);
    return res.status(401).send("Invalid token");
  }
};

module.exports = authMiddleware;