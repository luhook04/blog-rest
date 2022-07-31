const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: {
    type: String,
    required: true,
  },
  authorName: { type: String, required: true },
  comments: { type: Array, default: [] },
  published: { type: Boolean, default: false },
  timestampe: { type: Date, default: Date.now },
});

PostSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Post", PostSchema);
