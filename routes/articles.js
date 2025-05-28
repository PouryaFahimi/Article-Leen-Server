const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const auth = require("../middleware/auth");

// GET all articles
router.get("/", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// POST a new article
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const newArticle = new Article({ title, content });
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

router.put("/:id", async (req, res) => {
  // update an article by Id
  try {
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
