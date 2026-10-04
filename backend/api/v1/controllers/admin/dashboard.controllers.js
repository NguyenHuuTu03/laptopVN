const Products = require("../../../../models/product.model");
const Orders = require("../../../../models/order.model");
const OrderItems = require("../../../../models/order_item.model");
const Users = require("../../../../models/user.model");
const ProductVariants = require("../../../../models/product_variants.model");
const Roles = require("../../../../models/role.model");
//[GET] /api/admin
module.exports.dashboard = async (req, res) => {
  try {
    const orders = await Orders.find();
    const totalRevenue = orders.reduce((total, order) => {
      if (order.orderStatus === "DELIVERED") {
        return total + order.totalPrice;
      }
      return total;
    }, 0);
    const role = await Roles.findOne({
      deleted: false,
      status: "active",
      slug: "user",
    });
    const totalUser = await Users.countDocuments({
      deleted: false,
      status: "active",
      roleId: role.id,
    });

    const totalOrder = await Orders.countDocuments({
      orderStatus: { $ne: "CANCELLED" },
    });

    let totalProduct = 0;
    const deliverOrders = await Orders.find({
      orderStatus: "DELIVERED",
    });
    for (const order of deliverOrders) {
      const orderItems = await OrderItems.find({
        orderId: order.id,
      });
      const quantity = orderItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      totalProduct += quantity;
    }

    const pending = orders.reduce((total, order) => {
      if (order.orderStatus === "PENDING") {
        return ++total;
      }
      return total;
    }, 0);
    const confirmed = orders.reduce((total, order) => {
      if (order.orderStatus === "CONFIRMED") {
        return ++total;
      }
      return total;
    }, 0);
    const shipping = orders.reduce((total, order) => {
      if (order.orderStatus === "SHIPPING") {
        return ++total;
      }
      return total;
    }, 0);
    const delivered = orders.reduce((total, order) => {
      if (order.orderStatus === "DELIVERED") {
        return ++total;
      }
      return total;
    }, 0);
    const cancelled = orders.reduce((total, order) => {
      if (order.orderStatus === "CANCELLED") {
        return ++total;
      }
      return total;
    }, 0);
    const revenueByMonth = [];

    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      let revenue = 0;

      for (const order of orders) {
        const orderDate = new Date(order.createdAt);

        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;

        if (
          orderYear === currentYear &&
          orderMonth === month &&
          order.orderStatus === "DELIVERED"
        ) {
          revenue += order.totalPrice;
        }
      }

      revenueByMonth.push({
        month: month,
        revenue: revenue,
      });
    }

    const today = new Date();

    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;

    let todayRevenue = 0;

    for (const order of orders) {
      const orderDate = new Date(order.createdAt);

      const orderDay = orderDate.getDate();
      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();

      if (
        orderYear === currentYear &&
        orderMonth === currentMonth &&
        orderDay === currentDay &&
        order.orderStatus === "DELIVERED"
      ) {
        todayRevenue += order.totalPrice;
      }
    }

    let monthRevenue = 0;

    for (const order of orders) {
      const orderDate = new Date(order.createdAt);

      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();

      if (
        orderYear === currentYear &&
        orderMonth === currentMonth &&
        order.orderStatus === "DELIVERED"
      ) {
        monthRevenue += order.totalPrice;
      }
    }

    const featuredProducts = await Products.find({
      featured: true,
      deleted: false,
      status: "active",
    })
      .sort({
        position: -1,
      })
      .limit(5)
      .lean();
    for (const item of featuredProducts) {
      const variants = await ProductVariants.find({
        productId: item._id,
      });
      item.sold = variants.reduce((total, item) => total + item.sold, 0);
    }

    const recentOrders = await Orders.find({
      orderStatus: {
        $ne: "CANCELLED",
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(7);

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        overview: {
          totalProduct,
          totalUser,
          totalOrder,
          totalRevenue,
        },
        orders: {
          pending,
          confirmed,
          shipping,
          delivered,
          cancelled,
        },
        revenue: {
          today: todayRevenue,
          currentMonth: monthRevenue,
        },
        revenueByMonth,
        featuredProducts,
        recentOrders,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};
