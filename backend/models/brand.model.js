const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const brandSchema = new mongoose.Schema(
  {
    title: String,
    thumbnail: String,
    description: String,
    country: String,
    website: String,
    status: String,
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
    slug: {
      type: String,
      slug: "title",
    },
  },
  {
    timestamps: true,
  },
);

const Brands = mongoose.model("Brands", brandSchema, "brands");
module.exports = Brands;
