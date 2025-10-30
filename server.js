const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔐 Secret key for JWT signing
const SECRET_KEY = "mysecretkey";

// 🧍 Hardcoded sample user
const user = {
  id: 1,
  username: "testuser",
  password: "password123",
};

// ✅ Login Route (Generate Token)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// 🔎 Middleware for JWT verification
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Token is usually sent as: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // store user info
    next();
  });
}

// 🔒 Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

// 🌐 Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
