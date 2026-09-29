const Orders = require("../../../../models/order.model");
const OrderItems = require("../../../../models/order_item.model");
const Coupons = require("../../../../models/coupon.model");
const Products = require("../../../../models/product.model");
const ProductVariants = require("../../../../models/product_variants.model");

//[GET] /api/admin/orders
module.exports.index = async (req, res) => {
  try {
    let find = {};

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

    //sort
    let sort = {
      createdAt: -1,
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

    const totalOrders = await Orders.countDocuments(find);

    const totalPages = Math.ceil(totalOrders / limit);
    //pagination

    const orders = await Orders.find(find).sort(sort).skip(skip).limit(limit);
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        orders,
        pagination: {
          currentPage: page,
          limit,
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

//[GET] /api/admin/orders/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Orders.findOne({
      _id: orderId,
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
      message: "Lấy thông tin đơn hàng thành công!",
      data: {
        order,
        orderItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 500,
      message: "Lấy thông tin đơn hàng thất bại!",
    });
  }
};

//[PATCH] /api/admin/orders/:orderId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Orders.findOne({
      _id: orderId,
    });
    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
    }
    const { orderStatus } = req.body;
    order.orderStatus = orderStatus;
    await order.save();
    res.json({
      code: 200,
      message: "Cập nhật trạng thái đơn hàng thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật trạng thái đơn hàng thất bại!",
    });
  }
};
