const mongoose = require("mongoose");
const Schema = mongoose.Scehma;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxLength: 20,
  },
  password: { type: String, required: true },
});

modules.exports = mongoose.model("Admin", AdminSchema);
