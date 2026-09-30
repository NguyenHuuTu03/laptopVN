const Products = require("../../../../models/product.model");
const Categories = require("../../../../models/category.model");
const Brands = require("../../../../models/brand.model");
const convertToSlugHelpers = require("../../../../helpers/convertToSlug");
const ProductVariants = require("../../../../models/product_variants.model");
const sortHelpers = require("../../../../helpers/sort");

//[GET] /api/collections/:slug
module.exports.collections = async (req, res) => {
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

    // filter

    if (req.query.categoryId) {
      find.categoryId = req.query.categoryId;
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

    // filter

    //sort
    let sort = { position: -1 };
    if (req.query.sort) {
      const [sortKey, sortValue] = req.query.sort.split("-");

      sort = {
        [sortKey]: sortValue === "asc" ? 1 : -1,
      };
    }
    //sort

    const slug = req.params.slug;

    let collection;

    const category = await Categories.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (category) {
      find.categoryId = category.id;

      collection = {
        title: category.title,
        slug: category.slug,
        type: "category",
      };
    } else {
      const brand = await Brands.findOne({
        slug: slug,
        deleted: false,
        status: "active",
      });

      if (brand) {
        find.brandId = brand.id;

        collection = {
          title: brand.title,
          slug: brand.slug,
          type: "brand",
        };
      } else {
        return res.json({
          code: 404,
          message: "Không tìm thấy danh mục hoặc thương hiệu!",
        });
      }
    }

    const products = await Products.find(find).sort(sort).lean();

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
    sortHelpers.sortPrice(products, sort);

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 12, 1);
    const skip = (page - 1) * limit;
    //pagination
    const totalProducts = products.length;

    const totalPages = Math.ceil(totalProducts / limit);
    const productsPagination = products.slice(skip, skip + limit);

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        products: productsPagination,
        pagination: {
          currentPage: page,
          limit,
          totalProducts,
          totalPages,
        },
        collection,
      },
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.json({
      code: 400,
      message: "Thất bại!",
    });
  }
};
