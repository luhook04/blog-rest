const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");

router.get("/api", function (req, res, next) {
  res.redirect("/api/posts");
});

router.post("/sign-up", admin_controller.signup);

router.get("/posts", function (req, res, next) {
  res.json({ message: "Welcome" });
});

module.exports = router;
