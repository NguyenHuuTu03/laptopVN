const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Categories = require("../../../../models/category.model");
const Brands = require("../../../../models/brand.model");
const Carts = require("../../../../models/cart.model");
const CartItems = require("../../../../models/cart_item.model");
const Users = require("../../../../models/user.model");

//[GET] /api/cart (khi đã đăng nhập)
module.exports.cart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      res.json({
        code: 200,
        message: "Giỏ hàng đang trống!",
        data: {
          items: [],
        },
      });
      return;
    }

    const items = await CartItems.find({
      cartId: cart.id,
    });

    const result = [];

    for (const item of items) {
      const product = await Products.findOne({
        _id: item.productId,
        deleted: false,
        status: "active",
      });

      const variant = await ProductVariants.findOne({
        _id: item.variantId,
        productId: item.productId,
        status: "active",
      });

      result.push({
        productId: product.id,
        variantId: variant.id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        thumbnail: variant.thumbnail || product.thumbnail,
        attributes: variant.attributes,
      });
    }

    res.json({
      code: 200,
      message: "Lấy giỏ hàng thành công!",
      data: {
        items: result,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lấy giỏ hàng thất bại!",
    });
  }
};

//[POST] /api/cart/merge
module.exports.merge = async (req, res) => {
  try {
    const userId = req.userId;
    const { items = [] } = req.body.cart;

    if (items.length === 0) {
      res.json({
        code: 200,
        message: "Không có sản phẩm cần đồng bộ!",
      });
      return;
    }

    let cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      cart = await Carts.create({
        userId: userId,
      });
    }

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      const product = await Products.findOne({
        _id: productId,
        deleted: false,
        status: "active",
      });

      const cartItem = await CartItems.findOne({
        cartId: cart.id,
        productId: productId,
        variantId: variantId || null,
      });

      if (cartItem) {
        cartItem.quantity += Number(quantity);
        await cartItem.save();
      } else {
        await CartItems.create({
          cartId: cart.id,
          productId: productId,
          variantId: variantId || null,
          quantity: Number(quantity),
          price: product.price,
          discount: product.discount || 0,
          isSelected: true,
        });
      }
    }

    const cartItems = await CartItems.find({
      cartId: cart.id,
    });

    res.json({
      code: 200,
      message: "Merge giỏ hàng thành công!",
      data: {
        cart,
        items: cartItems,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Merge giỏ hàng thất bại!",
    });
  }
};

//[POST] /api/cart/sync
module.exports.sync = async (req, res) => {
  try {
    const userId = req.userId;
    const { items = [] } = req.body.cart;

    let cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      cart = await Carts.create({
        userId: userId,
      });
    }

    await CartItems.deleteMany({
      cartId: cart.id,
    });

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      const product = await Products.findOne({
        _id: productId,
        deleted: false,
        status: "active",
      });

      const variant = await ProductVariants.findOne({
        _id: variantId,
        productId: productId,
        status: "active",
      });

      await CartItems.create({
        cartId: cart.id,
        productId: productId,
        variantId: variantId || null,
        quantity: Number(quantity),
        price: variant.price,
        discount: variant.discount || 0,
        isSelected: true,
      });
    }

    const cartItems = await CartItems.find({
      cartId: cart.id,
    });

    res.json({
      code: 200,
      message: "Đồng bộ giỏ hàng thành công!",
      data: {
        items: cartItems,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Đồng bộ giỏ hàng thất bại!",
    });
  }
};

//[POST] /api/cart/preview (lấy sản phẩm trong giỏ khi chưa đăng nhập)
module.exports.preview = async (req, res) => {
  try {
    const { items = [] } = req.body.cart;
    if (items.length < 1) {
      res.json({
        code: 400,
        message: "Giỏ hàng đang trống",
      });
      return;
    }

    const result = [];

    for (const item of items) {
      const { productId, variantId, quantity } = item;
      const product = await Products.findOne({
        deleted: false,
        status: "active",
        _id: productId,
      });

      const variant = await ProductVariants.findOne({
        _id: variantId,
        productId: productId,
        status: "active",
      });

      result.push({
        productId: product.id,
        variantId: variantId,
        quantity: Number(quantity),
        title: product.title,
        thumbnail: variant.thumbnail || product.thumbnail,
        price: variant.price,
        discount: variant.discount,
        attributes: variant.attributes,
      });
    }
    res.json({
      code: 200,
      message: "Lấy dữ liệu giỏ hàng thành công!",
      data: {
        items: result,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lấy dữ liệu giỏ hàng thất bại!",
    });
  }
};

// [POST] /api/cart/add
module.exports.add = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, variantId, quantity } = req.body;
    const qty = Number(quantity);

    if (!productId || !Number.isInteger(qty) || qty <= 0) {
      return res.json({
        code: 400,
        message: "Dữ liệu không hợp lệ",
      });
    }

    const product = await Products.findOne({
      _id: productId,
      deleted: false,
      status: "active",
    });

    const variant = await ProductVariants.findOne({
      _id: variantId,
      productId: productId,
      status: "active",
    });

    if (variant.stock < qty) {
      res.json({
        code: 400,
        message: `Sản phẩm chỉ còn ${variant.stock} sản phẩm`,
      });
      return;
    }

    let cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      cart = await Carts.create({
        userId: userId,
      });
    }

    let cartItem = await CartItems.findOne({
      cartId: cart.id,
      productId: productId,
      variantId: variantId,
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + qty;

      if (newQuantity > variant.stock) {
        res.json({
          code: 400,
          message: `Chỉ còn ${variant.stock} sản phẩm trong kho`,
        });
        return;
      }

      cartItem.quantity = newQuantity;
      cartItem.price = variant.price;
      cartItem.discount = variant.discount || 0;

      await cartItem.save();
    } else {
      cartItem = await CartItems.create({
        cartId: cart.id,
        productId: productId,
        variantId: variantId,
        quantity: qty,
        price: variant.price,
        discount: variant.discount,
        isSelected: true,
      });
    }

    const item = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: cartItem.quantity,
    };

    res.json({
      code: 200,
      message: "Thêm sản phẩm vào giỏ hàng thành công!",
      data: {
        item,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm sản phẩm vào giỏ hàng thất bại!",
    });
  }
};

//[PATCH] /api/cart/update/:cartItemId
module.exports.update = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.json({
        code: 400,
        message: "Số lượng không hợp lệ",
      });
    }

    const cart = await Carts.findOne({
      userId,
    });

    if (!cart) {
      return res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại",
      });
    }

    const cartItem = await CartItems.findOne({
      _id: cartItemId,
      cartId: cart._id,
    });

    if (!cartItem) {
      return res.json({
        code: 404,
        message: "Sản phẩm không có trong giỏ hàng",
      });
    }

    const variant = await ProductVariants.findOne({
      _id: cartItem.variantId,
      productId: cartItem.productId,
      status: "active",
    });

    if (qty > variant.stock) {
      return res.json({
        code: 400,
        message: `Chỉ còn ${variant.stock} sản phẩm`,
      });
    }

    cartItem.quantity = qty;
    cartItem.price = variant.price;
    cartItem.discount = variant.discount || 0;

    await cartItem.save();

    const item = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: cartItem.quantity,
    };

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công!",
      data: {
        item,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật số lượng thất bại!",
    });
  }
};

//[DELETE] /api/cart/delete/:cartItemId
module.exports.delete = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;

    const cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại",
      });
      return;
    }

    const cartItem = await CartItems.findOne({
      _id: cartItemId,
      cartId: cart.id,
    });

    if (!cartItem) {
      res.json({
        code: 404,
        message: "Sản phẩm không có trong giỏ",
      });
      return;
    }

    await CartItems.deleteOne({
      _id: cartItemId,
      cartId: cart._id,
    });

    res.json({
      code: 200,
      message: "Xoá sản phẩm khỏi giỏ hàng thành công!",
      data: {
        cartItemId: cartItemId,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xóa sản phẩm khỏi giỏ hàng thất bại",
    });
  }
};
