const Orders = require("../../../../models/order.model");
const OrderItems = require("../../../../models/order_item.model");
const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Carts = require("../../../../models/cart.model");
const CartItems = require("../../../../models/cart_item.model");
const Coupons = require("../../../../models/coupon.model");

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
        attributes: variant.attributes,
      });
    }

    const total = result.reduce((total, item) => total + item.totalPrice, 0);
    const totalQuantity = result.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = total;
    res.json({
      code: 200,
      message: "Lấy thông tin đặt hàng thành công!",
      data: {
        items: result,
        summary: {
          subtotal,
          total,
          totalQuantity,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Không thể lấy thông tin đặt hàng!",
    });
  }
};

// [POST] /api/order/apply-coupon
module.exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode = "" } = req.body;
    const userId = req.userId;
    const cart = await Carts.findOne({
      userId: userId,
    });

    if (!cart) {
      return res.json({
        code: 400,
        message: "Giỏ hàng đang trống!",
      });
    }

    const cartItems = await CartItems.find({
      cartId: cart._id,
    });

    const code = couponCode.trim();

    if (!code) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập mã giảm giá!",
      });
    }

    const result = [];

    for (const item of cartItems) {
      const product = await Products.findOne({
        _id: item.productId,
        deleted: false,
        status: "active",
      });

      if (!product) {
        return res.json({
          code: 400,
          message: "Sản phẩm không tồn tại!",
        });
      }

      const variant = await ProductVariants.findOne({
        _id: item.variantId,
        productId: item.productId,
        status: "active",
      });

      if (!variant) {
        return res.json({
          code: 400,
          message: `Không tìm thấy phiên bản của sản phẩm "${product.title}"!`,
        });
      }

      const priceNew = Math.round(variant.price * (1 - variant.discount / 100));
      result.push({
        quantity: item.quantity,
        price: item.price,
        priceNew: priceNew,
      });
    }

    const subtotal = result.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const productDiscount = result.reduce(
      (total, item) => total + (item.price - item.priceNew) * item.quantity,
      0,
    );
    const totalQuantity = result.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const afterProductDiscount = subtotal - productDiscount;

    const coupon = await Coupons.findOne({
      code: code,
      deleted: false,
      status: "active",
    });

    if (!coupon) {
      return res.json({
        code: 400,
        message: "Mã giảm giá không tồn tại!",
      });
    }

    const now = new Date();

    if (coupon.startDate && now < coupon.startDate) {
      return res.json({
        code: 400,
        message: "Mã giảm giá chưa bắt đầu!",
      });
    }

    if (coupon.endDate && now > coupon.endDate) {
      return res.json({
        code: 400,
        message: "Mã giảm giá đã hết hạn!",
      });
    }

    if (coupon.quantity != null && coupon.usedCount >= coupon.quantity) {
      return res.json({
        code: 400,
        message: "Mã giảm giá đã hết lượt sử dụng!",
      });
    }

    if (coupon.minOrderValue && afterProductDiscount < coupon.minOrderValue) {
      return res.json({
        code: 400,
        message: `Đơn hàng phải có giá trị tối thiểu ${new Intl.NumberFormat(
          "vi-VN",
        ).format(coupon.minOrderValue)}đ!`,
      });
    }

    let voucherDiscount = 0;

    if (coupon.discountType === "percent") {
      voucherDiscount = Math.round(
        afterProductDiscount * (coupon.discountValue / 100),
      );

      if (coupon.maxDiscount && voucherDiscount > coupon.maxDiscount) {
        voucherDiscount = coupon.maxDiscount;
      }
    }

    if (coupon.discountType === "fixed") {
      voucherDiscount = coupon.discountValue;
    }

    if (voucherDiscount > afterProductDiscount) {
      voucherDiscount = afterProductDiscount;
    }

    const total = afterProductDiscount - voucherDiscount;

    const saving = productDiscount + voucherDiscount;

    res.json({
      code: 200,
      message: "Áp dụng mã giảm giá thành công!",
      data: {
        summary: {
          subtotal: afterProductDiscount,
          voucherDiscount,
          total,
          totalQuantity,
        },
      },
    });
  } catch (error) {
    return res.json({
      code: 500,
      message: "Áp dụng mã giảm giá thất bại!",
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
      note,
      paymentMethod,
      couponCode,
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
        _id: item.productId,
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
        _id: item.variantId,
        productId: item.productId,
        status: "active",
      });

      if (item.quantity > variant.stock) {
        return res.json({
          code: 400,
          message: `Sản phẩm "${product.title}" chỉ còn ${variant.stock} sản phẩm`,
        });
      }

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      });
    }

    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const productDiscount = orderItems.reduce(
      (total, item) =>
        total + ((item.price * item.discount) / 100) * item.quantity,
      0,
    );

    const afterProductDiscount = Math.round(subtotal - productDiscount);
    let voucherDiscount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupons.findOne({
        code: couponCode,
        status: "active",
        deleted: false,
      });

      if (!coupon) {
        return res.json({
          code: 404,
          message: "Không tồn tại mã giảm giá!",
        });
      }

      const now = new Date();

      if (coupon.startDate && now < coupon.startDate) {
        return res.json({
          code: 400,
          message: "Mã giảm giá chưa bắt đầu!",
        });
      }

      if (coupon.endDate && now > coupon.endDate) {
        return res.json({
          code: 400,
          message: "Mã giảm giá đã hết hạn!",
        });
      }

      if (coupon.quantity != null && coupon.usedCount >= coupon.quantity) {
        return res.json({
          code: 400,
          message: "Mã giảm giá đã hết lượt sử dụng!",
        });
      }

      if (coupon.minOrderValue && afterProductDiscount < coupon.minOrderValue) {
        return res.json({
          code: 400,
          message: `Đơn hàng phải có giá trị tối thiểu ${new Intl.NumberFormat(
            "vi-VN",
          ).format(coupon.minOrderValue)}đ!`,
        });
      }

      if (coupon.discountType === "percent") {
        voucherDiscount = Math.round(
          afterProductDiscount * (coupon.discountValue / 100),
        );

        if (coupon.maxDiscount && voucherDiscount > coupon.maxDiscount) {
          voucherDiscount = coupon.maxDiscount;
        }
      }

      if (coupon.discountType === "fixed") {
        voucherDiscount = coupon.discountValue;
      }

      if (voucherDiscount > afterProductDiscount) {
        voucherDiscount = afterProductDiscount;
      }
    }

    totalPrice = afterProductDiscount - voucherDiscount;

    const orderCode = "ORD-" + Date.now();

    const order = new Orders({
      orderCode: orderCode,
      userId: userId,
      shippingName: shippingName,
      shippingPhone: shippingPhone,
      shippingAddress: shippingAddress,
      couponId: coupon ? coupon._id : null,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "WAITING_PAYMENT",

      orderStatus: "PENDING",
      note: note,
    });

    await order.save();

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

    if (paymentMethod === "COD") {
      await CartItems.deleteMany({
        cartId: cart._id,
      });
    }

    res.json({
      code: 200,
      message:
        paymentMethod === "COD"
          ? "Đặt hàng thành công!"
          : "Tạo đơn hàng, chờ thanh toán!",
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

        const priceNew = Math.round(item.price * (1 - item.discount / 100));
        items.push({
          productId: product.id,
          variantId: item.variantId,
          title: product.title,
          thumbnail: variant.thumbnail || product.thumbnail,
          quantity: item.quantity,
          price: item.price,
          priceNew: priceNew,
          discount: item.discount,
          attributes: variant.attributes,
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

//[GET] /api/order/:orderCode
module.exports.orderDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderCode } = req.params;

    const order = await Orders.findOne({
      orderCode: orderCode,
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

      const priceNew = Math.round(item.price * (1 - item.discount / 100));
      result.push({
        productId: item.productId,
        variantId: item.variantId,
        title: product.title,
        thumbnail: variant.thumbnail || product.thumbnail,
        price: item.price,
        priceNew: priceNew,
        discount: item.discount,
        quantity: item.quantity,
        attributes: variant.attributes,
      });
    }

    const totalQuantity = result.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = result.reduce(
      (total, item) => total + item.priceNew * item.quantity,
      0,
    );
    let voucherDiscount = 0;
    if (order.couponId) {
      const coupon = await Coupons.findOne({
        _id: order.couponId,
        deleted: false,
        status: "active",
      });

      if (coupon.discountType === "percent") {
        voucherDiscount = Math.round(subtotal * (coupon.discountValue / 100));

        if (coupon.maxDiscount && voucherDiscount > coupon.maxDiscount) {
          voucherDiscount = coupon.maxDiscount;
        }
      }

      if (coupon.discountType === "fixed") {
        voucherDiscount = coupon.discountValue;
      }

      if (voucherDiscount > subtotal) {
        voucherDiscount = subtotal;
      }
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết đơn hàng thành công!",
      data: {
        order: {
          orderId: order._id,
          orderCode: order.orderCode,
          subtotal,
          shippingName: order.shippingName,
          shippingPhone: order.shippingPhone,
          shippingAddress: order.shippingAddress,
          totalQuantity,
          totalPrice: order.totalPrice,
          voucherDiscount,
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

//[PATCH] /api/order/cancel/:orderCode
module.exports.cancel = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderCode } = req.params;

    const order = await Orders.findOne({
      orderCode: orderCode,
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
