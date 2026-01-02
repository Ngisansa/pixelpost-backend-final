const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    image: String,
    platforms: [String],
    scheduledAt: Date,
    status: { type: String, default: "draft" },
    author: String,
    meta: Object,
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
