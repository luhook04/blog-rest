const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const post_controller = require("../controllers/postController");
const passport = require("passport");

router.get("/api", function (req, res, next) {
  res.redirect("/api/posts");
});

router.post("/sign-up", admin_controller.signup);
router.post("/login", admin_controller.login);

router.get("/posts", post_controller.get_posts);
router.get("/posts/:id", post_controller.get_single_post);
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.create_post
);

module.exports = router;
