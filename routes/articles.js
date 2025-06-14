const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// GET all articles
router.get("/", async (req, res) => {
  const articles = await Article.find().select("-__v");
  res.json(articles);
  console.log(">> GET Articles");
});

// GET one article by Id
router.get("/:articleId", async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId).select("-__v");
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET all articles of one user
router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const articles = await Article.find({ username: user.username }).select(
      "-__v"
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new article
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  const decoded = jwt.decode(token);
  const username = decoded.username;
  const newArticle = new Article({ title, content, username });
  await newArticle.save();
  res.status(201).json(newArticle);
  console.log(">> Incoming POST:", req.body);
});

router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Article.find({
      title: { $regex: query, $options: "i" }, // case-insensitive search
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  // update an article by Id
  try {
    const prev = await Article.findById(req.params.id);
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    const decoded = jwt.decode(token);
    const username = decoded.username;
    if (username !== prev.username)
      return res.status(400).json({ error: "Invalid credentials" });
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});

module.exports = router;
