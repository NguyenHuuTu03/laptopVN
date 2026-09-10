const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cartId: String,
    productId: String,
    variantId: String,
    quantity: Number,
    price: Number,
    discount: Number,
    isSelected: Boolean,
  },
  {
    timestamps: true,
  },
);

const CartItems = mongoose.model("CartItems", cartItemSchema, "cart_items");
module.exports = CartItems;
