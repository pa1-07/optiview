const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);