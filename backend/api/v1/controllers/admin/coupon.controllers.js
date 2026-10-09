const Coupons = require("../../../../models/coupon.model");

//[GET] /api/admin/coupons
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    //search
    if (req.query.keyword) {
      const keywordRegex = new RegExp(req.query.keyword, "i");
      find.code = keywordRegex;
    }
    //search

    //filter
    if (req.query.status) {
      find.status = req.query.status;
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
    //pagination

    const coupons = await Coupons.find(find).sort(sort).limit(limit).skip(skip);

    const totalCoupons = await Coupons.countDocuments(find);
    const totalPages = Math.ceil(totalCoupons / limit);
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        coupons,
        pagination: {
          currentPage: page,
          limit,
          totalCoupons,
          totalPages,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 200,
      message: "Thất bại!",
    });
  }
};

//[PATCH] /api/admin/coupons/:couponId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupons.findOne({
      _id: couponId,
      deleted: false,
    });
    if (!coupon) {
      return res.json({
        code: 404,
        message: "Không tìm thấy mã giảm!",
      });
    }
    const { status } = req.body;
    coupon.status = status;
    await coupon.save();
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật trạng thái thất bại!",
    });
  }
};

//[GET] /api/admin/coupons/:couponId
module.exports.detail = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupons.findOne({
      _id: couponId,
      deleted: false,
    });
    if (!coupon) {
      return res.json({
        code: 404,
        message: "Không tìm thấy mã giảm!",
      });
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        coupon,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/admin/coupons
module.exports.create = async (req, res) => {
  try {
    const exitsCoupon = await Coupons.findOne({
      code: req.body.code,
      deleted: false,
    });

    if (exitsCoupon) {
      return res.json({
        code: 400,
        message: "Mã giảm đã tồn tại!",
      });
    }

    const coupon = new Coupons({
      code: req.body.code,
      description: req.body.description,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      maxDiscount: req.body.maxDiscount,
      quantity: req.body.quantity,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    await Coupons.save();

    res.json({
      code: 200,
      message: "Thêm mã giảm thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm mã giảm thất bại!",
    });
  }
};

//[PATCH] /api/admin/coupons/:couponId
module.exports.edit = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupons.findOne({
      _id: couponId,
      deleted: false,
    });
    if (!coupon) {
      return res.json({
        code: 404,
        message: "Không tìm thấy mã giảm",
      });
    }

    const exitsCoupon = await Coupons.findOne({
      _id: { $ne: couponId },
      code: req.body.code,
      deleted: false,
    });

    if (exitsCoupon) {
      return res.json({
        code: 400,
        message: "Mã giảm đã tồn tại!",
      });
    }

    await Coupons.updateOne(
      {
        _id: couponId,
      },
      req.body,
    );

    res.json({
      code: 200,
      message: "Cập nhật mã giảm thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật mã giảm thất bại!",
    });
  }
};

//[DELETE] /api/admin/coupons/:couponId
module.exports.delete = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const coupon = await Coupons.findOne({
      _id: couponId,
      deleted: false,
    });

    if (!couponId) {
      return res.json({
        code: 404,
        message: "Không tìm thấy mã giảm",
      });
    }
    coupon.deleted = true;
    await coupon.save();
    res.json({
      code: 200,
      message: "Xoá mã giảm thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá mã giảm thất bại!",
    });
  }
};
