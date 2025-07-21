const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const results = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .select("-password -__v");

    res.json(results);
    console.log("?? Searched for Users:", query);
  } catch (err) {
    res.status(500).json({ error: "Search error" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -__v"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
    console.log(">> GET one User username:", req.params.username);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
