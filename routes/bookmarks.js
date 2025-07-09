// routes/bookmark.js
const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const auth = require("../middleware/auth");
const { addFlagsToArticles } = require("../utils/articleFlags");

// Bookmark an article
router.post("/:articleId", auth, async (req, res) => {
  try {
    const { articleId } = req.params;

    const bookmark = new Bookmark({
      userId: req.user,
      articleId,
    });

    await bookmark.save();
    res.status(201).json({ message: "Bookmarked successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Article already bookmarked" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

// Remove a bookmark
router.delete("/:articleId", auth, async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      userId: req.user,
      articleId: req.params.articleId,
    });

    if (!result) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

// Get all bookmarks of current user
router.get("/", auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user }).sort({ createdAt: -1 }).populate(
      "articleId"
    );
    const bookmarkedArticles = bookmarks.map((bookmark) => bookmark.articleId);

    const articlesWithFlags = await addFlagsToArticles(
      bookmarkedArticles,
      req.user
    );

    res.json(articlesWithFlags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

module.exports = router;
