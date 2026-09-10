const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    orderId: String,
    rating: Number,
    content: String,
    images: {
      type: Array,
      default: [],
    },
    status: String,
  },
  {
    timestamps: true,
  },
);

const Reviews = mongoose.model("Reviews", reviewSchema, "reviews");
module.exports = Reviews;
