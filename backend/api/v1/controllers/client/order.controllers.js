const Orders = require("../../../../models/order.model");
const OrderItems = require("../../../../models/order_item.model");
const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Carts = require("../../../../models/cart.model");
const CartItems = require("../../../../models/cart_item.model");

//[GET] /api/order/checkout
module.exports.checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại!",
      });
      return;
    }

    const cartItems = await CartItems.find({
      cartId: cart.id,
    });

    if (cartItems.length === 0) {
      return res.json({
        code: 400,
        message: "Giỏ hàng đang trống",
      });
    }

    const result = [];

    for (const item of cartItems) {
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

      const priceNew = Number(
        (item.price * (1 - item.discount / 100)).toFixed(2),
      );

      result.push({
        cartItemId: item.id,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        thumbnail: variant.thumbnail || product.thumbnail,
        price: item.price,
        priceNew: priceNew,
        discount: item.discount || 0,
        quantity: item.quantity,
        totalPrice: priceNew * item.quantity,
      });
    }

    const totalPrice = result.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );

    res.json({
      code: 200,
      message: "Lấy thông tin đặt hàng thành công!",
      data: {
        items: result,
        totalPrice,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Không thể lấy thông tin đặt hàng!",
    });
  }
};

//[POST] /api/order
module.exports.order = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      shippingName,
      shippingPhone,
      shippingAddress,
      paymentMethod,
      note,
    } = req.body;

    const cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      return res.json({
        code: 404,
        message: "Giỏ hàng không tồn tại",
      });
    }

    const cartItems = await CartItems.find({
      cartId: cart._id,
    });

    if (cartItems.length === 0) {
      return res.json({
        code: 400,
        message: "Chưa có sản phẩm nào được chọn",
      });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of cartItems) {
      const product = await Products.findOne({
        _id: cartItem.productId,
        deleted: false,
        status: "active",
      });

      if (!product) {
        return res.json({
          code: 400,
          message: "Sản phẩm không tồn tại hoặc đã ngừng bán",
        });
      }

      const variant = await ProductVariants.findOne({
        _id: cartItem.variantId,
        productId: cartItem.productId,
        status: "active",
      });

      if (item.quantity > variant.stock) {
        return res.json({
          code: 400,
          message: `Sản phẩm "${product.title}" chỉ còn ${stock} sản phẩm`,
        });
      }

      const priceNew = Number(
        (item.price * (1 - item.discount / 100)).toFixed(2),
      );

      const totalPrice = priceNew * item.quantity;

      orderItems.push({
        productId: product._id,
        variantId: variant.id,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      });
    }

    const orderCode = "ORD-" + Date.now();

    const order = new Order({
      orderCode: orderCode,
      userId: userId,
      shippingName: shippingName,
      shippingPhone: shippingPhone,
      shippingAddress: shippingAddress,

      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "WAITING_PAYMENT",

      orderStatus: "PENDING",
      note: note || "",
    });

    await OrderItems.insertMany(
      orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      })),
    );

    await CartItems.deleteMany({
      cartId: cart._id,
    });

    res.json({
      code: 200,
      message: "Đặt hàng thành công!",
      data: {
        orderId: order.id,
        orderCode: order.orderCode,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Tạo đơn hàng thất bại!",
    });
  }
};

//[GET] /api/order/my-orders
module.exports.myOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Orders.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    const result = [];

    for (const order of orders) {
      const orderItems = await OrderItems.find({
        orderId: order.id,
      });

      const items = [];

      for (const item of orderItems) {
        const product = await Products.findOne({
          _id: item.productId,
        });

        const variant = await ProductVariants.findOne({
          _id: item.variantId,
        });

        items.push({
          productId: product.id,
          variantId: item.variantId,
          title: product.title,
          thumbnail: variant.thumbnail || product.thumbnail,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        });
      }

      result.push({
        orderId: order.id,
        orderCode: order.orderCode,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        items: items,
      });
    }
    res.json({
      code: 200,
      message: "Lấy danh sách đơn hàng thành công!",
      data: { result },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Không thể lấy danh sách đơn hàng!",
    });
  }
};

//[GET] /api/order/:orderId
module.exports.orderDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Orders.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const orderItems = await OrderItems.find({
      orderId: order.id,
    });

    const result = [];

    for (const item of orderItems) {
      const product = await Products.findOne({
        _id: item.productId,
      });

      const variant = await ProductVariants.findOne({
        _id: item.variantId,
        productId: item.productId,
      });

      result.push({
        productId: item.productId,
        variantId: item.variantId,
        title: product.title,
        thumbnail: variant.thumbnail || product.thumbnail,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      });
    }
    res.json({
      code: 200,
      message: "Lấy chi tiết đơn hàng thành công!",
      data: {
        order: {
          orderId: order._id,
          orderCode: order.orderCode,

          shippingName: order.shippingName,
          shippingPhone: order.shippingPhone,
          shippingAddress: order.shippingAddress,

          totalPrice: order.totalPrice,

          couponId: order.couponId,

          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,

          orderStatus: order.orderStatus,

          note: order.note,

          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
        items: result,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Không thể lấy chi tiết đơn hàng!",
    });
  }
};

//[PATCH] /api/order/cancel/:orderId
module.exports.cancel = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Orders.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
      return;
    }

    if (order.orderStatus !== "PENDING") {
      res.json({
        code: 400,
        message: "Đơn hàng không thể huỷ",
      });
    }

    order.orderStatus = "CANCELLED";

    await order.save();

    res.json({
      code: 200,
      message: "Huỷ đơn hàng thành công!",
      data: {
        orderId: order.id,
        orderCode: order.orderCode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Huỷ đơn hàng thất bại!",
    });
  }
};
