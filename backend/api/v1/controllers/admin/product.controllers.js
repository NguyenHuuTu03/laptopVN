const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Brands = require("../../../../models/brand.model");
const Categories = require("../../../../models/category.model");
const convertToSlugHelpers = require("../../../../helpers/convertToSlug");
const sortHelpers = require("../../../../helpers/sort");

//[GET] /api/admin/products
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    // search
    if (req.query.keyword) {
      const keywordRegex = new RegExp(req.query.keyword, "i");
      const slug = convertToSlugHelpers.convertToSlug(req.query.keyword);
      const slugRegex = new RegExp(slug, "i");
      find.$or = [{ title: keywordRegex }, { slug: slugRegex }];
    }
    // search

    //filter
    if (req.query.status) {
      find.status = req.query.status;
    }
    if (req.query.featured) {
      find.featured = req.query.featured === "true";
    }
    if (req.query.categoryId) {
      find.categoryId = req.query.categoryId;
    }
    if (req.query.brandId) {
      find.brandId = req.query.brandId;
    }
    //filter

    let sort = {
      position: -1,
    };

    if (req.query.sort) {
      const [sortKey, sortValue] = req.query.sort.split("-");

      sort = {
        [sortKey]: sortValue === "asc" ? 1 : -1,
      };
    }
    const products = await Products.find(find)
      .sort(sort)
      .select("title thumbnail slug position status brandId categoryId")
      .lean();

    for (const product of products) {
      const variants = await ProductVariants.find({
        productId: product._id,
        status: "active",
      });

      const variant = variants.reduce((min, item) =>
        item.price < min.price ? item : min,
      );

      product.newPrice = variant.price;
      product.stock = variants.reduce((total, item) => total + item.stock, 0);

      const brand = await Brands.findOne({
        _id: product.brandId,
        deleted: false,
        status: "active",
      }).select("title");

      product.brandName = brand.title;

      const category = await Categories.findOne({
        _id: product.categoryId,
        deleted: false,
        status: "active",
      }).select("title");
      product.categoryName = category.title;
    }

    sortHelpers.sortPrice(products, sort);

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    //pagination

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    const productsPagination = products.slice(skip, skip + limit);

    const categories = await Categories.find({
      deleted: false,
      status: "active",
    });
    const brands = await Brands.find({
      deleted: false,
      status: "active",
    });
    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm thành công!",
      data: {
        products: productsPagination,
        categories,
        brands,
        pagination: {
          currentPage: page,
          limit: limit,
          totalProducts,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[PATCH] /api/admin/products/:productId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Products.findOne({
      _id: productId,
      deleted: false,
    });

    if (!product) {
      res.json({
        code: 404,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    const { status } = req.body;

    product.status = status;
    await product.save();
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

//[POST] /api/admin/products
module.exports.create = async (req, res) => {
  try {
    const slug = convertToSlugHelpers.convertToSlug(req.body.title);
    const exitsProduct = await Products.find({
      slug: slug,
      deleted: false,
    });

    if (exitsProduct) {
      res.json({
        code: 400,
        message: "Sản phẩm đã tồn tại!",
      });
      return;
    }
    const totalProduct = await Products.countDocuments();
    const product = new Products({
      title: req.body.title,
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      description: req.body.description,
      images: req.body.images ? req.body.images : [],
      thumbnail: req.body.thumbnail ? req.body.thumbnail : "",
      position: req.body.position ? req.body.position : totalProduct + 1,
      specifications: req.body.specifications,
      warranty: req.body.warranty,
      featured: req.body.featured ? req.body.featured : false,
    });
    await product.save();
    res.json({
      code: 200,
      message: "Thêm sản phẩm thành công!",
      data: {
        product,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm sản phẩm thất bại!",
    });
  }
};

//[PATCH] /api/admin/products/:productId
module.exports.edit = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findOne({
      _id: productId,
      deleted: false,
    });
    if (!product) {
      res.json({
        code: 404,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    if (req.body.images) {
      product.images = req.body.images;
    }

    if (req.body.thumbnail) {
      product.thumbnail = req.body.thumbnail;
    }

    await product.save();

    res.json({
      code: 200,
      message: "Cập nhật sản phẩm thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật sản phẩm thất bại!",
    });
  }
};

//[DELETE] /api/admin/products/:productId
module.exports.delete = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findOne({
      _id: productId,
      deleted: false,
    });

    if (!product) {
      res.json({
        code: 404,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    product.deleted = true;
    await product.save();
    res.json({
      code: 200,
      message: "Xoá sản phẩm thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá sản phẩm thất bại!",
    });
  }
};

// [GET] /api/admin/products/:productId
module.exports.detail = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findOne({
      _id: productId,
      deleted: false,
    }).lean();
    if (!product) {
      res.json({
        code: 404,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    const brand = await Brands.findOne({
      _id: product.brandId,
      deleted: false,
    }).select("title");

    const category = await Categories.findOne({
      _id: product.categoryId,
      deleted: false,
    }).select("title");

    product.brandName = brand.title;
    product.categoryName = category.title;

    const variants = await ProductVariants.find({
      productId: product._id,
      status: "active",
    });

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        product,
        variants,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};
