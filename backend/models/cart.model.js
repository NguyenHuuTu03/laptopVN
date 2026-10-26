const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: String,
  },
  {
    timestamps: true,
  },
);

const Carts = mongoose.model("Carts", cartSchema, "carts");
module.exports = Carts;
