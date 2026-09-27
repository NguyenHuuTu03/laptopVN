const Products = require("../../../../models/product.model");
const Orders = require("../../../../models/order.model");
const Users = require("../../../../models/user.model");
const ProductVariants = require("../../../../models/product_variants.model");
//[GET] /api/admin/dashboard
module.exports.dashboard = async (req, res) => {
  try {
    const totalProduct = await Products.countDocuments({
      deleted: false,
      status: "active",
    });

    const totalUser = await Users.countDocuments({
      deleted: false,
      status: "active",
    });

    const orders = await Orders.find();

    let totalOrder = 0;
    let totalRevenue = 0;

    let pending = 0;
    let confirmed = 0;
    let shipping = 0;
    let delivered = 0;
    let cancelled = 0;

    for (const order of orders) {
      if (order.orderStatus !== "CANCELLED") totalOrder++;
      if (order.orderStatus === "PENDING") {
        pending++;
      }

      if (order.orderStatus === "CONFIRMED") {
        confirmed++;
      }

      if (order.orderStatus === "SHIPPING") {
        shipping++;
      }

      if (order.orderStatus === "DELIVERED") {
        delivered++;
      }

      if (order.orderStatus === "CANCELLED") {
        cancelled++;
      }
      if (order.orderStatus === "DELIVERED") {
        totalRevenue += order.totalPrice;
      }
    }

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
      .limit(5);

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
          total: totalRevenue,
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
