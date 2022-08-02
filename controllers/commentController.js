const { body, validationResult } = require("express-validator");
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
      username: req.body.text,
      text: req.body.text,
      postId: req.params.id,
    });
    let post = await Post.findById(req.params.id);
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
