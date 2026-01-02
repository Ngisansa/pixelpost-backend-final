require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(console.error);

app.use("/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));

app.get("/", (_, res) => {
  res.send("PixelPost backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
