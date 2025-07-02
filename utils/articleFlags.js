const Like = require("../models/Like");
const Bookmark = require("../models/Bookmark");

async function addFlagsToArticles(articles, userId) {
  const isArray = Array.isArray(articles);
  if (!isArray) articles = [articles];

  const articleIds = articles.map((a) => a._id);

  const [likedArticles, bookmarkedArticles] = await Promise.all([
    Like.find({ userId, articleId: { $in: articleIds } }),
    Bookmark.find({ userId, articleId: { $in: articleIds } }),
  ]);

  const likedSet = new Set(
    likedArticles.map((like) => like.articleId.toString())
  );
  const bookmarkedSet = new Set(
    bookmarkedArticles.map((b) => b.articleId.toString())
  );

  const enhancedArticles = articles.map((article) => {
    const id = article._id.toString();
    return {
      ...article.toObject(),
      isLiked: likedSet.has(id),
      isBookmarked: bookmarkedSet.has(id),
    };
  });

  return isArray ? enhancedArticles : enhancedArticles[0];
}

module.exports = {
  addFlagsToArticles,
};
