const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// GET all articles
router.get("/", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// POST a new article
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const newArticle = new Article({ title, content });
  await newArticle.save();
  res.status(201).json(newArticle);
  console.log(">> Incoming POST:", req.body);
});

module.exports = router;
