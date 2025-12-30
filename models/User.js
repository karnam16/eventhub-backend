const mongoose = require("mongoose");

// This defines how a User document looks in MongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // no two users with same email
  },
  password: {
    type: String,
    required: true,
  },
});

// Convert schema into a model
module.exports = mongoose.model("User", userSchema);
