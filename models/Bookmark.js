const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
  },
});

// unique bookmarks
bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
