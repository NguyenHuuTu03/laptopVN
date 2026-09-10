const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Roles = mongoose.model("Roles", roleSchema, "roles");
module.exports = Roles;
