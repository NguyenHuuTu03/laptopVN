module.exports.createOrder = (req, res, next) => {
  const { shippingName, shippingPhone, shippingAddress, paymentMethod } =
    req.body;

  if (!shippingName || !shippingPhone || !shippingAddress || !paymentMethod) {
    return res.json({
      code: 400,
      message: "Vui lòng nhập đầy đủ thông tin đặt hàng",
    });
  }

  next();
};
