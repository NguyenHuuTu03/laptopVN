const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    categoryId: String,
    brandId: String,
    description: String,
    images: {
      type: Array,
      default: [],
    },
    thumbnail: String,

    position: Number,

    specifications: {
      type: Array,
      default: [],
    },
    warranty: String,
    status: String,
    featured: {
      type: Boolean,
      default: false,
    },

    slug: {
      type: String,
      slug: "title",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    createdBy: String,
    updatedBy: {
      type: Array,
      default: [],
    },
    deletedBy: String,
  },
  {
    timestamps: true,
  },
);

const Products = mongoose.model("Products", productSchema, "products");
module.exports = Products;
