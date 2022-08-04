const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");
const passport = require("passport");

router.get("/api", function (req, res, next) {
  res.redirect("/api/posts");
});

// admin routes
router.post("/sign-up", admin_controller.signup);
router.post("/login", admin_controller.login);
router.post("/logout", admin_controller.logout);

// post routes
router.get("/posts", post_controller.get_posts);
router.get("/posts/:postId", post_controller.get_single_post);
router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.update_post
);
router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_post
);
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.create_post
);

// comment routes
router.post("/posts/:postId/comments", comment_controller.create_comment);
router.get("/posts/:postId/comments", comment_controller.get_comments);
router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  comment_controller.delete_comment
);

module.exports = router;
