const Coupons = require("../../../../models/coupon.model");

module.exports.index = async (req, res) => {
  try {
    const coupons = await Coupons.find({
      deleted: false,
      status: "active",
    }).sort({ endDate: 1 });

    const result = coupons.filter((coupon) => coupon.endDate > Date.now());

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        coupons: result,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};
