require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

/* ======================
   Trust Render Proxy
====================== */
app.set("trust proxy", 1);

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

/* ======================
   Routes
====================== */
app.use("/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/payments", require("./routes/payments"));

/* ======================
   Health Check
====================== */
app.get("/", (req, res) => {
  res.send("PixelPost backend running");
});

/* ======================
   Database + Server
====================== */
mongoose.set("bufferCommands", false);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ Mongo connected");

    require("./cron/scheduler");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Mongo failed:", err);
    process.exit(1);
  });
