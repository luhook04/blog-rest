const { body, validationResult } = require("express-validator");
const comment = require("../models/comment");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.create_comment = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username can't be blank"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Comment can't be blank"),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ data: req.body, errors: errors.array() });
      return;
    }
    const comment = new Comment({
      username: req.body.username,
      text: req.body.text,
      postId: req.params.postId,
    });
    let post = await Post.findById(req.params.postId);
    post.comments = [...post.comments, comment];
    post = await post.save();
    comment.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: `Comment ${comment._id} sent` });
    });
  },
];

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({});
    if (!comments) {
      return res.status(404).json({ err: `No comments found` });
    }
    const orderedComments = comments
      .filter((comment) => comment.postId === req.params.postId)
      .sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json({ orderedComments });
  } catch (err) {
    next(err);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.postId);
    let postComment = await Comment.findById(req.params.commentId);
    let newComments = post.comments.filter(
      (comment) => comment.toString() !== postComment._id.toString()
    );
    post.comments = [...newComments];
    post = await post.save();

    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json(`Comment ${req.params.commentId} not found`);
    }
    return res
      .status(200)
      .json({ message: `Deleted comment ${req.params.commentId}` });
  } catch (err) {
    next(err);
  }
};
