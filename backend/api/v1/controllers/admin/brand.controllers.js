const Brands = require("../../../../models/brand.model");
const convertToSlugHelpers = require("../../../../helpers/convertToSlug");

//[GET] /api/admin/brands
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    //search
    if (req.query.keyword) {
      const keywordRegex = new RegExp(req.query.keyword, "i");
      const slug = convertToSlugHelpers.convertToSlug(req.query.keyword);
      const slugRegex = new RegExp(slug, "i");
      find.$or = [{ title: keywordRegex }, { slug: slugRegex }];
    }
    //search

    //filter
    if (req.query.status) {
      find.status = req.query.status;
    }
    if (req.query.country) {
      find.country = req.query.country;
    }
    //filter

    const allBrands = await Brands.find({
      deleted: false,
    }).select("country");
    let countries = [];
    for (const brand of allBrands) {
      if (!countries.includes(brand.country)) {
        countries.push(brand.country);
      }
    }

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

    const brands = await Brands.find(find)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select("title thumbnail position country status");

    const totalBrands = await Brands.countDocuments(find);
    const totalPages = Math.ceil(totalBrands / limit);

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        brands,
        countries,
        pagination: {
          currentPage: page,
          limit,
          totalBrands,
          totalPages,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại",
    });
  }
};

//[GET] /api/admin/brands/:brandId
module.exports.detail = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brand = await Brands.findOne({
      _id: brandId,
      deleted: false,
    });

    if (!brand) {
      return res.json({
        code: 404,
        message: "Không tìm thấy thương hiệu",
      });
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        brand,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/admin/brands
module.exports.create = async (req, res) => {
  try {
    const slug = convertToSlugHelpers.convertToSlug(req.body.title);
    const exitsBrand = await Brands.findOne({
      slug: slug,
      deleted: false,
    });
    if (exitsBrand) {
      return res.json({
        code: 400,
        message: "Thương hiệu đã tồn tại!",
      });
    }
    const totalBrand = await Brands.countDocuments();
    const brand = new Brands({
      title: req.body.title,
      thumbnail: req.body.thumbnail ? req.body.thumbnail : "",
      description: req.body.description,
      country: req.body.country,
      website: req.body.website ? req.body.website : "",
      position: req.body.position ? req.body.position : totalBrand + 1,
    });
    await brand.save();
    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[PATCH] /api/admin/brands/:brandId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brand = await Brands.findOne({
      _id: brandId,
      deleted: false,
    });
    if (!brand) {
      return res.json({
        code: 404,
        message: "Không tìm thấy thương hiệu!",
      });
    }
    const { status } = req.body;
    brand.status = status;
    await brand.save();
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

//[PATCH] /api/admin/brands/:brandId
module.exports.edit = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brand = await Brands.findOne({
      _id: brandId,
      deleted: false,
    });
    if (!brand) {
      return res.json({
        code: 404,
        message: "Không tìm thấy thương hiệu!",
      });
    }
    if (req.body.thumbnail) {
      brand.thumbnail = req.body.thumbnail;
    }
    await brand.save();
    res.json({
      code: 200,
      message: "Cập nhật thương hiệu thành công!",
      data: {
        brand,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật thương hiệu thất bại!",
    });
  }
};

//[DELETE] /api/admin/brands/:brandId
module.exports.delete = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brand = await Brands.findOne({
      _id: brandId,
      deleted: false,
    });
    if (!brand) {
      return res.json({
        code: 404,
        message: "Không tìm thấy thương hiệu!",
      });
    }
    brand.deleted = true;
    await brand.save();
    res.json({
      code: 200,
      message: "Xoá thương hiệu thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá thương hiệu thất bại!",
    });
  }
};
