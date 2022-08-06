const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      maxLength: 20,
    },
    text: {
      type: String,
      required: true,
      maxLength: 300,
    },
    postId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Comment", CommentSchema);
