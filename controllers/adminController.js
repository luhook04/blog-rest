const Admin = require("../models/admin");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.signup = [
  body("username", "Username required")
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await Admin.findOne({
          username: username,
        });
        if (existingUsername) {
          throw new Error("username already in use");
        }
      } catch (err) {
        throw new Error(err);
      }
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be 5 characters long"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        username: req.body.username,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const admin = new Admin({
          username: req.body.username,
          password: hashedPassword,
        });
        admin.save((err, user) => {
          if (err) return next(err);
          res.redirect("/");
          return res.json(user);
        });
      });
    }
  },
];
