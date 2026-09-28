const Categories = require("../../../../models/category.model");
const convertToSlugHelpers = require("../../../../helpers/convertToSlug");

//[GET] /api/admin/categories
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    //search
    if (req.body.keyword) {
      const keywordRegex = new RegExp(req.body.keyword, "i");
      const slug = convertToSlugHelpers.convertToSlug(req.body.keyword);
      const slugRegex = new RegExp(slug, "i");
      find.$or = [{ title: keywordRegex }, { slug: "slugRegex" }];
    }
    //search

    //filter
    if (req.query.status) {
      find.status = req.query.status;
    }
    if (req.query.parentId) {
      find.parentId = req.query.parentId;
    }
    //filter

    //sort
    let sort = {
      position: -1,
    };
    if (req.query.sort) {
      const [sortKey, sortValue] = req.query.sort.split("-");

      sort = {
        [sortKey]: sortValue === "asc" ? 1 : -1,
      };
    }
    //sort

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    //pagination

    const categories = await Categories.find(find)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const totalCategories = categories.length;
    const totalPages = Math.ceil(totalCategories / limit);
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        categories,
        pagination: {
          currentPage: page,
          limit,
          totalCategories,
          totalPages,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/admin/categories/:categoryId
module.exports.detail = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Categories.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!category) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục sản phẩm!",
      });
    }

    const children = await Categories.find({
      parentId: category.id,
      deleted: false,
    }).sort({ position: -1 });

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        category,
        children,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/admin/categories
module.exports.create = async (req, res) => {
  try {
    const slug = convertToSlugHelpers.convertToSlug(req.body.title);
    const exitsCategory = await Categories.findOne({
      slug: slug,
      deleted: false,
    });
    if (exitsCategory) {
      return res.json({
        code: 400,
        message: "Danh mục đã tồn tại!",
      });
    }
    const totalCategories = await Categories.countDocuments();

    const category = new Categories({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail ? req.body.thumbnail : "",
      parentId: req.body.parentId,
      position: req.body.position ? req.body.position : totalCategories + 1,
    });

    await category.save();
    res.json({
      code: 200,
      message: "Thêm danh mục thành công",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm danh mục thất bại!",
    });
  }
};

//[PATCH] /api/admin/categories/:categoryId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Categories.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!category) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục sản phẩm!",
      });
    }
    const { status } = req.body;
    category.status = status;
    await category.save();
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật trạng thái thất bại!",
    });
  }
};

//[PATCH] /api/admin/categories/:categoryId
module.exports.edit = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Categories.findOne({
      _id: categoryId,
      deleted: false,
    });

    if (!category) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục!",
      });
    }

    if (req.body.thumbnail) {
      category.thumbnail = req.body.thumbnail;
    }

    await category.save();

    res.json({
      code: 200,
      message: "Cập nhật danh mục thành công!",
      data: {
        category,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật danh mục thất bại!",
    });
  }
};

//[DELETE] /api/admin/categories/:categoryId
module.exports.delete = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Categories.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!category) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục!",
      });
    }
    category.deleted = true;
    await category.save();
    res.json({
      code: 200,
      message: "Xoá danh mục thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá danh mục thất bại!",
    });
  }
};
