const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productVariantSchema = new mongoose.Schema(
  {
    productId: String,
    sku: String,
    attributes: {
      type: Array,
      default: [],
    },
    price: Number,
    discount: Number,
    stock: Number,
    sold: Number,
    thumbnail: String,
    status: String,
  },
  {
    timestamps: true,
  },
);

const ProductVariants = mongoose.model(
  "ProductVariants",
  productVariantSchema,
  "product_variants",
);

module.exports = ProductVariants;
