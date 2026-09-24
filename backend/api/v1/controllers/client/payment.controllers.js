const Orders = require("../../../../models/order.model");
const { VNPay, HashAlgorithm, ProductCode } = require("vnpay");

// [POST] /api/payment/vnpay
module.exports.paymentVNPay = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Orders.findOne({
      _id: orderId,
      userId: req.userId,
    });

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    if (order.paymentMethod !== "VNPay") {
      return res.json({
        code: 400,
        message: "Đơn hàng không sử dụng VNPay!",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.json({
        code: 400,
        message: "Đơn hàng đã được thanh toán!",
      });
    }

    const vnpay = new VNPay({
      tmnCode: process.env.TMNCODE || "9TWVC9IM",
      secureSecret:
        process.env.SECURE_SECRET || "PT3TGXTHDKYFU1RYW3G8CXS0D3JK8KML",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true,
    });

    const paymentUrl = vnpay.buildPaymentUrl({
      // Lấy tiền từ Order trong DB, không lấy từ frontend
      vnp_Amount: Number(order.totalPrice),

      vnp_IpAddr: req.ip || "127.0.0.1",

      // VNPay gọi về BACKEND
      vnp_ReturnUrl: "http://localhost:8080/api/payment/vnpay-return",

      vnp_TxnRef: order.orderCode,

      vnp_OrderInfo: `Thanh toan don hang ${order.orderCode}`,

      vnp_OrderType: ProductCode.Other,

      vnp_Locale: "vn",

      vnp_CurrCode: "VND",
    });

    return res.json({
      code: 200,
      message: "Tạo URL thanh toán thành công!",
      data: {
        paymentUrl,
        orderId: order._id,
        orderCode: order.orderCode,
        totalPrice: order.totalPrice,
      },
    });
  } catch (error) {
    console.error("VNPAY CREATE ERROR:", error);

    return res.json({
      code: 500,
      message: "Không thể tạo URL thanh toán!",
    });
  }
};

// [GET] /api/payment/vnpay-return
module.exports.vnpayReturn = async (req, res) => {
  try {
    const vnpay = new VNPay({
      tmnCode: process.env.TMNCODE || "9TWVC9IM",
      secureSecret:
        process.env.SECURE_SECRET || "PT3TGXTHDKYFU1RYW3G8CXS0D3JK8KML",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true,
    });

    const verify = vnpay.verifyReturnUrl(req.query);

    const orderCode = req.query.vnp_TxnRef;

    const order = await Orders.findOne({
      orderCode: orderCode,
    });

    if (!order) {
      return res.redirect(
        "http://localhost:5173/orders/payment-result?status=not-found",
      );
    }

    if (verify.isSuccess) {
      await Orders.updateOne(
        { _id: order._id },
        {
          paymentStatus: "PAID",
        },
      );

      return res.redirect(
        `http://localhost:5173/orders/payment-result/${order.orderCode}?status=success`,
      );
    }

    await Orders.updateOne(
      { _id: orderId },
      {
        paymentStatus: "FAILED",
      },
    );

    return res.redirect(
      `http://localhost:5173/orders/payment-result/${order.orderCode}?status=failed`,
    );
  } catch (error) {
    console.error("VNPAY RETURN ERROR:", error);

    return res.redirect(
      "http://localhost:5173/orders/payment-result?status=error",
    );
  }
};
