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
    position: Number,
    status: {
      type: String,
      default: "active",
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
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Brands = mongoose.model("Brands", brandSchema, "brands");
module.exports = Brands;
