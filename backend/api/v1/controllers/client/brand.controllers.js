const Brands = require("../../../../models/brand.model");
const Products = require("../../../../models/product.model");
//[GET] /api/brands
module.exports.brand = async (req, res) => {
  try {
    const { categoryId } = req.query;

    let brands;

    if (categoryId) {
      const products = await Products.find({
        categoryId,
        deleted: false,
        status: "active",
      }).select("brandId");

      const brandIds = [
        ...new Set(
          products
            .map((product) => product.brandId?.toString())
            .filter(Boolean),
        ),
      ];

      brands = await Brands.find({
        _id: { $in: brandIds },
        deleted: false,
        status: "active",
      });
    } else {
      brands = await Brands.find({
        deleted: false,
        status: "active",
      });
    }

    res.json({
      code: 200,
      data: {
        brands,
      },
      message: "Thành công!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      code: 500,
      message: "Có lỗi xảy ra!",
    });
  }
};
