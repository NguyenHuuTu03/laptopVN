const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: String,
    productId: String,
    variantId: String,
    price: Number,
    discount: Number,
    quantity: Number,
  },
  {
    timestamps: true,
  },
);

const OrderItems = mongoose.model("OrderItems", orderItemSchema, "order_items");
module.exports = OrderItems;
