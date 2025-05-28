const jwt = require("jsonwebtoken");
const JWT_SECRET = "your-secret-key"; // use env variable in production

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = auth;
