const Categories = require("../../../../models/category.model");

//[GET] /api/categories
module.exports.category = async (req, res) => {
  try {
    const categories = await Categories.find({
      deleted: false,
      status: "active",
    });

    const parentCategories = categories.filter(
      (category) => !category.parentId,
    );

    const result = parentCategories.map((parent) => {
      const children = categories.filter(
        (category) => category.parentId === parent.id,
      );
      return {
        ...parent,
        children: children,
      };
    });

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        categories,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thất bại!",
    });
  }
};
