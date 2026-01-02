const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
