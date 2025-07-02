const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const articleRoutes = require("./routes/articles");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const likesRoutes = require("./routes/likes");
const bookmarksRoutes = require("./routes/bookmarks");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/user", userRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/bookmarks", bookmarksRoutes);

// DB Connection
mongoose
  .connect("mongodb://localhost:27017/articleDB")
  .then(() => {
    console.log("$$ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`$$ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(">< DB Error:", err));
