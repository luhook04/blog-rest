const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.create_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title required for post"),
  body("text")
    .trim()
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

exports.get_single_post = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ err: `Post with id ${req.params.postId} not found` });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.update_post = async function (req, res, next) {
  try {
    const updatedPost = {
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
    };
    let post = await Post.findByIdAndUpdate(req.params.postId, updatedPost, {});
    post = await post.save();
    if (!post) {
      return res.status(404).json({ msg: "Update failed" });
    }
    res.status(200).json({ msg: "Update successful" });
  } catch (err) {
    next(err);
  }
};

exports.delete_post = async function (req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ err: `Post ${req.params.postId} not found` });
    }
    let deletedComments = await Comment.deleteMany({
      postId: req.params.postId,
    });
    res.status(200).json({
      msg: `Post ${req.params.postId} deleted`,
      comments: deletedComments,
    });
  } catch (err) {
    next(err);
  }
};
