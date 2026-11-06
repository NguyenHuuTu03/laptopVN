const Orders = require("../../../../models/order.model");
const OrderItems = require("../../../../models/order_item.model");
const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Coupons = require("../../../../models/coupon.model");
const Users = require("../../../../models/user.model");
const Roles = require("../../../../models/role.model");

//[GET] /api/admin/shipper/orders
module.exports.orders = async (req, res) => {
  try {
    let find = {
      orderStatus: "CONFIRMED",
    };
    // pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const totalOrders = await Orders.countDocuments(find);

    const totalPages = Math.ceil(totalOrders / limit);
    // pagination
    const orders = await Orders.find(find)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        orders,
        pagination: {
          currentPage: page,
          limit: limit,
          totalOrders,
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

//[PATCH] /api/admin/shipper/:orderId/accept
module.exports.acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { shipperId } = req.body;

    await Orders.updateOne(
      { _id: orderId },
      {
        shipperId: shipperId,
      },
    );

    const shipper = await Users.findOne({
      _id: shipperId,
      status: "active",
      deleted: false,
    });

    const newOrder = await Orders.findOne({
      _id: orderId,
    }).lean();

    newOrder.shipper = shipper;

    return res.json({
      code: 200,
      message: "Phân công đơn hàng thành công!",
      data: {
        order: newOrder,
      },
    });
  } catch (error) {
    return res.json({
      code: 500,
      message: "Phân công đơn hàng thất bại!",
    });
  }
};

//[GET] /api/admin/shipper/orders/received
module.exports.receivedOrders = async (req, res) => {
  try {
    const shipperId = req.userId;
    let find = { shipperId: shipperId };

    //search
    if (req.query.keyword) {
      find.shippingPhone = req.query.keyword;
    }
    //search

    //filter
    if (req.query.orderStatus) {
      find.orderStatus = req.query.orderStatus;
    }
    if (req.query.paymentMethod) {
      find.paymentMethod = req.query.paymentMethod;
    }
    //filter

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const totalOrders = await Orders.countDocuments(find);

    const totalPages = Math.ceil(totalOrders / limit);
    //pagination
    const orders = await Orders.find(find)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        orders,
        pagination: {
          currentPage: page,
          limit: limit,
          totalOrders,
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

//[PATCH] /api/admin/shipper/:orderId/change-status
module.exports.changeStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const shipperId = req.userId;
  const { orderStatus } = req.body;

  const order = await Orders.findOne({
    _id: orderId,
    shipperId: shipperId,
  });

  if (!order) {
    return res.json({
      code: 404,
      message: "Không tìm thấy đơn hàng!",
    });
  }

  if (order.orderStatus !== "SHIPPING") {
    return res.json({
      code: 400,
      message: "Đơn hàng không ở trạng thái đang giao!",
    });
  }

  const status = ["DELIVERED", "FAILED"];

  if (!status.includes(orderStatus)) {
    return res.json({
      code: 400,
      message: "Trạng thái không hợp lệ!",
    });
  }

  order.orderStatus = orderStatus;
  if (orderStatus === "DELIVERED" && order.paymentMethod === "COD") {
    order.paymentStatus = "PAID";
  }
  await order.save();

  try {
    res.json({
      code: 200,
      message:
        orderStatus === "DELIVERED"
          ? "Giao hàng thành công!"
          : "Giao hàng thất bại!",
      data: {
        order,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật trạng thái đơn hàng thất bại!",
    });
  }
};

//[GET] /api/admin/shipper/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const shipperId = req.userId;
    const order = await Orders.findOne({
      _id: orderId,
      shipperId: shipperId,
    });
    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
    }
    const coupon = await Coupons.findOne({
      _id: order.couponId,
    });
    if (order.couponId) {
      order.coupon = coupon.code;
    }
    const orderItems = await OrderItems.find({
      orderId: order._id,
    }).lean();
    for (const item of orderItems) {
      const product = await Products.findOne({
        _id: item.productId,
      }).select("title");
      const variant = await ProductVariants.findOne({
        _id: item.variantId,
        productId: item.productId,
      }).select("sku attributes thumbnail");
      item.product = product;
      item.variant = variant;
      const priceNew = Math.round(item.price * (1 - item.discount / 100));
      item.priceNew = priceNew;
    }
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        order,
        orderItems,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[GET] /api/admin/shipper
module.exports.shipper = async (req, res) => {
  try {
    const role = await Roles.findOne({
      title: "Shipper",
      deleted: false,
      status: "active",
    });

    if (!role) {
      return res.json({
        code: 404,
        message: "Không tìm thấy vai trò Shipper!",
      });
    }

    const shippers = await Users.find({
      roleId: role.id,
      deleted: false,
      status: "active",
    }).select("fullName avatar email phone");

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        shippers,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};
