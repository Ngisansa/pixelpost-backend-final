const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
  res.json({
    id: "guest",
    email: null,
    role: "guest",
    credits: 0
  });
});

module.exports = router;
