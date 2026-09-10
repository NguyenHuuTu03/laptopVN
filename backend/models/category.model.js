const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  parentId: String,
  position: Number,
  status: String,
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
});

const Categories = mongoose.model("Categories", categorySchema, "categories");
module.exports = Categories;
