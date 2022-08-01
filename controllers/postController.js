const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.create_post = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Title required for post"),
  body("text")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Content required for post"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      authorName: req.user.username,
    });
    post.save((err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ post });
    });
  },
];

exports.get_posts = async function (req, res, next) {
  try {
    const posts = await Post.find({});
    posts.sort((a, b) => b.timestamp - a.timestamp);
    if (!posts) {
      return res.status(404).json({ err: "posts not found" });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};
