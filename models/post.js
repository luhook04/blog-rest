const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxLength: 20,
  },
  password: { type: String, required: true },
});
