const ProductVariants = require("../models/product_variants.model");
const Coupons = require("../models/coupon.model");

module.exports.restockItems = async (items) => {
  for (const item of items) {
    await ProductVariants.updateOne(
      { _id: item.variantId, productId: item.productId },
      { $inc: { stock: item.quantity } },
    );
  }
};

module.exports.releaseCoupon = async (couponId) => {
  if (!couponId) return;

  await Coupons.updateOne(
    {
      _id: couponId,
      usedCount: { $gt: 0 },
    },
    {
      $inc: {
        usedCount: -1,
      },
    },
  );
};
