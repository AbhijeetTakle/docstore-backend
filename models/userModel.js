const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  name: { type: String },
  link: { type: String },
});

const userSchema = new mongoose.Schema({
  usermail: { type: String, required: true, index: { unique: true } },
  documents: [docSchema],
});

const userModel = mongoose.model("users", userSchema);

module.exports = { userModel, userSchema, docSchema };
