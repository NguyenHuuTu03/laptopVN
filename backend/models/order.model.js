const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderCode: String,
    userId: String,
    shippingName: String,
    shippingPhone: String,
    shippingAddress: String,
    totalPrice: Number,
    couponId: String,
    paymentMethod: String,
    paymentStatus: String,
    orderStatus: String,
    note: String,
  },
  {
    timestamps: true,
  },
);

const Orders = mongoose.model("Orders", orderSchema, "orders");
module.exports = Orders;
