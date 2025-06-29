const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");
const Like = require("../models/Like");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// GET all articles
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user;

    const articles = await Article.find().select("-__v");

    const likes = await Like.find({ userId }).select("articleId");
    const likedArticleIds = new Set(
      likes.map((like) => like.articleId.toString())
    );

    const articlesWithIsLiked = articles.map((article) => {
      const isLiked = likedArticleIds.has(article._id.toString());
      return {
        ...article.toObject(),
        isLiked,
      };
    });

    res.json(articlesWithIsLiked);
    console.log(">> GET Articles");
  } catch (err) {
    res.status(500).json({ message: "Failed to get articles", error: err });
  }
});

// GET one article by Id
router.get("/:articleId", auth, async (req, res) => {
  try {
    const userId = req.user;
    const article = await Article.findById(req.params.articleId).select("-__v");
    if (!article) return res.status(404).json({ error: "Article not found" });
    const liked = await Like.exists({
      userId,
      articleId: req.params.articleId,
    });
    res.json({ ...article.toObject(), isLiked: !!liked });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET all articles of one user
router.get("/user/:username", auth, async (req, res) => {
  try {
    // await auth(req, res);
    const userId = req.user;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const articles = await Article.find({ username: user.username }).select(
      "-__v"
    );

    const articlesWithIsLiked = await Promise.all(
      articles.map(async (article) => {
        const liked = await Like.exists({ userId, articleId: article._id });
        return {
          ...article.toObject(),
          isLiked: !!liked,
        };
      })
    );

    res.json(articlesWithIsLiked);
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

// update an article by Id
router.put("/:id", auth, async (req, res) => {
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
