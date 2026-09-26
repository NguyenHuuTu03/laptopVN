const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const convertToSlugHelpers = require("../../../../helpers/convertToSlug");
const Brands = require("../../../../models/brand.model");
const Categories = require("../../../../models/category.model");
// //[GET] /api/products
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
      status: "active",
    };

    // search
    if (req.query.keyword) {
      const keywordReg = new RegExp(req.query.keyword, "i");
      const slugReg = new RegExp(
        convertToSlugHelpers.convertToSlug(req.query.keyword),
        "i",
      );
      find.$or = [{ title: keywordReg }, { slug: slugReg }];
    }
    // search

    //filter
    if (req.query.category) {
      const categorySlugs = req.query.category.split(",");
      const categories = await Categories.find({
        slug: { $in: categorySlugs },
        deleted: false,
        status: "active",
      }).select("_id");
      find.categoryId = {
        $in: categories.map((category) => category._id),
      };
    }

    if (req.query.brand) {
      const brandSlugs = req.query.brand.split(",");

      const brands = await Brands.find({
        slug: { $in: brandSlugs },
        deleted: false,
        status: "active",
      }).select("_id");

      find.brandId = {
        $in: brands.map((brand) => brand._id),
      };
    }

    if (req.query.featured === "true") {
      find.featured = true;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      const priceFind = {};

      if (req.query.minPrice) {
        priceFind.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        priceFind.$lte = Number(req.query.maxPrice);
      }

      const variants = await ProductVariants.find({
        price: priceFind,
      }).select("productId");

      const productIds = [
        ...new Set(variants.map((variant) => variant.productId.toString())),
      ];

      find._id = {
        $in: productIds,
      };
    }
    //filter

    //sort
    let sort = { position: -1 };
    if (req.query.sort) {
      const [sortKey, sortValue] = req.query.sort.split("-");

      sort = {
        [sortKey]: sortValue === "asc" ? 1 : -1,
      };
    }
    //sort

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 12, 1);
    const skip = (page - 1) * limit;
    //pagination

    const totalProducts = await Products.countDocuments(find);

    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Products.find(find)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    for (const product of products) {
      const variant = await ProductVariants.findOne({
        productId: product._id,
      }).sort({ price: 1 });
      product.price = variant.price;
      product.discount = variant.discount || 0;
      product.newPrice = Math.round(
        variant.price * (1 - variant.discount / 100),
      );

      // const reviews = await Review.find({
      //   productId: product._id,
      //   status: "active",
      // })
      //   .select("rating")
      //   .lean();

      // const averageRating =
      //   reviewCount > 0
      //     ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      //       reviewCount
      //     : 0;

      // product.reviewCount = reviewCount;
      // product.averageRating = Number(averageRating.toFixed(1));
    }
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        products,
        pagination: {
          currentPage: page,
          limit,
          totalProducts,
          totalPages,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/products/compare
module.exports.compare = async (req, res) => {
  try {
    const ids = req.query.ids.split(", ") || [];

    const products = await Products.find({
      _id: { $in: ids },
      deleted: false,
      status: "active",
    });

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        products,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/products/:slugProduct
module.exports.detailProduct = async (req, res) => {
  try {
    const slugProduct = req.params.slugProduct;
    const product = await Products.findOne({
      deleted: false,
      status: "active",
      slug: slugProduct,
    });

    const variants = await ProductVariants.find({
      productId: product.id,
    }).lean();

    for (const variant of variants) {
      variant.priceNew = Math.floor(
        variant.price * (1 - variant.discount / 100),
      );
    }

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
      code: 400,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/products/suggest
module.exports.suggest = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active",
    };

    const keyword = req.query.keyword.trim();
    if (!keyword) {
      return res.json({
        code: 200,
        data: {
          products: [],
        },
      });
    }
    const keywordReg = new RegExp(req.query.keyword, "i");
    const slugReg = new RegExp(
      convertToSlugHelpers.convertToSlug(req.query.keyword),
      "i",
    );
    find.$or = [{ title: keywordReg }, { slug: slugReg }];

    const products = await Products.find(find)
      .limit(5)
      .select("title thumbnail slug")
      .lean();

    for (const product of products) {
      const variant = await ProductVariants.findOne({
        productId: product._id,
      }).sort({ price: 1 });
      product.price = variant.price;
      product.discount = variant.discount || 0;
      product.newPrice = Math.round(
        variant.price * (1 - variant.discount / 100),
      );
    }
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        products,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/products/:slugProduct/related
module.exports.related = async (req, res) => {
  try {
    const { slugProduct } = req.params;

    const product = await Products.findOne({
      slug: slugProduct,
      deleted: false,
      status: "active",
    }).lean();

    if (!product) {
      return res.json({
        code: 404,
        message: "Không tìm thấy sản phẩm!",
      });
    }

    const products = await Products.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId,
      deleted: false,
      status: "active",
    }).lean();

    for (const product of products) {
      const variant = await ProductVariants.findOne({
        productId: product._id,
      }).sort({ price: 1 });
      product.price = variant.price;
      product.discount = variant.discount || 0;
      product.newPrice = Math.round(
        variant.price * (1 - variant.discount / 100),
      );
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        products,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thất bại!",
    });
  }
};
