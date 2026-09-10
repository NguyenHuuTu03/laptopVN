const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: String,
    description: String,
    discountType: String,
    discountValue: Number,
    minOrderValue: Number,
    maxDiscount: Number,
    quantity: Number,
    usedCount: Number,
    startDate: Date,
    endDate: Date,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const Coupons = mongoose.model("Coupons", couponSchema, "coupons");
module.exports = Coupons;
