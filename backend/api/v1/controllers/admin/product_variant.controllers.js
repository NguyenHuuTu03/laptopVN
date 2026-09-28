const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");

//[POST] /api/admin/product-variants
module.exports.create = async (req, res) => {
  try {
    const product = await Products.findOne({
      _id: productId,
      deleted: false,
    });

    if (!product) {
      return res.json({
        code: 400,
        message: "Sản phẩm không tồn tại!",
      });
    }
    let sku = "";
    let existVariant = null;

    do {
      sku = generateSKU();

      existVariant = await ProductVariants.findOne({
        sku,
      });
    } while (existVariant);

    const variant = new ProductVariants({
      productId: product.id,
      sku: sku,
      attributes: req.body.attributes ? req.body.attributes : [],
      price: req.body.price,
      discount: req.body.discount || 0,
      stock: req.body.stock || 0,
      sold: 0,
      thumbnail: req.body.thumbnail ? req.body.thumbnail : "",
    });
    await variant.save();
    res.json({
      code: 200,
      message: "Thêm variant thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm variant thất bại!",
    });
  }
};

//[PATCH] /api/admin/product-variants/:variantId
module.exports.edit = async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const variant = await ProductVariants.findOne({
      _id: variantId,
    });

    if (!variant) {
      return res.json({
        code: 404,
        message: "Không tìm thấy variant!",
      });
    }
    const { attributes, price, discount, stock, thumbnail } = req.body;
    if (attributes.length > 0) {
      variant.attributes = attributes;
    }
    if (price < 0) {
      return res.json({
        code: 400,
        message: "Giá sản phẩm không hợp lệ!",
      });
    }
    variant.price = price;

    if (discount < 0) {
      return res.json({
        code: 400,
        message: "Giảm giá không hợp lệ!",
      });
    }
    variant.discount = discount;
    if (stock < 0) {
      return res.json({
        code: 400,
        message: "Số lượng tồn kho không hợp lệ!",
      });
    }
    variant.stock = stock;

    if (thumbnail) {
      variant.thumbnail = thumbnail;
    }

    await variant.save();

    res.json({
      code: 200,
      message: "Cập nhật variant thành công!",
      data: {
        variant,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật variant thất bại!",
    });
  }
};

//[DELETE] /api/admin/product-variants/:variantId
module.exports.delete = async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const variant = await ProductVariants.findOne({
      _id: variantId,
    });
    if (!variant) {
      return res.json({
        code: 404,
        message: "Không tìm thấy variant!",
      });
    }
    const { status } = req.body;
    variant.status = status;
    await variant.save();

    res.json({
      code: 200,
      message: "Xoá variant thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá variant thất bại!",
    });
  }
};
