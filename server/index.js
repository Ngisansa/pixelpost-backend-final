require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const morgan = require('morgan');
app.use(morgan('combined'));

/* =====================
   Middleware
===================== */
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

require('./cron/scheduler');

/* =====================
   Database
===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });

/* =====================
   Routes
===================== */
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));

/* =====================
   Health Check
===================== */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "PixelPost Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =====================
   Server
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
