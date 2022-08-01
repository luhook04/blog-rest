const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const passport = require("passport");

router.get("/api", function (req, res, next) {
  res.redirect("/api/posts");
});

router.post("/sign-up", admin_controller.signup);

router.post("/login", admin_controller.login);

router.get("/posts", function (req, res, next) {
  res.json({ message: "Welcome" });
});

module.exports = router;
