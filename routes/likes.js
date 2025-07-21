const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const auth = require("../middleware/auth");
const { addFlagsToArticles } = require("../utils/articleFlags");

// Like an article
router.post("/:articleId", auth, async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user;

  try {
    const like = await Like.create({ userId, articleId });
    res.status(201).json({ message: "Article liked", like });
    console.log("++ POST Like:", like);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already liked" });
    }
    res.status(500).json({ message: "Failed to like article", error: err });
  }
});

// Unlike an article
router.delete("/:articleId", auth, async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user;

  try {
    const result = await Like.findOneAndDelete({ userId, articleId });

    if (!result) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.status(200).json({ message: "Article unliked" });
    console.log("-- DELETE Like:", result);
  } catch (err) {
    res.status(500).json({ message: "Failed to unlike article", error: err });
  }
});

// GET all liked articles of current user
router.get("/user", auth, async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .populate("articleId");
    const likedArticles = likes.map((like) => like.articleId);

    const articlesWithFlags = await addFlagsToArticles(likedArticles, req.user);

    res.json(articlesWithFlags);
    console.log(">> GET all Likes of username:", req.username);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get liked articles", error: err });
  }
});

// GET users who liked an article (for later)
router.get("/:articleId", async (req, res) => {
  try {
    const likes = await Like.find({ articleId: req.params.articleId }).populate(
      "userId"
    );
    const users = likes.map((like) => like.userId);
    res.json({ users });
    console.log(">> GET Users liked one Article id:", req.params.articleId);
  } catch (err) {
    res.status(500).json({ message: "Failed to get likes", error: err });
  }
});

module.exports = router;
