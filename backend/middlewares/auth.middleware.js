const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");

module.exports.requireClientAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: 401,
        message: "Vui lòng đăng nhập!",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.json({
      code: 401,
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
    return;
  }
};
module.exports.requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.json({
        code: 401,
        message: "Vui lòng đăng nhập!",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      _id: decoded.id,
      deleted: false,
      status: "active",
    }).select("-password");

    if (!user) {
      return res.json({
        code: 401,
        message: "Tài khoản không tồn tại hoặc đã bị khóa!",
      });
    }

    if (!user.roleId) {
      return res.json({
        code: 403,
        message: "Tài khoản không có quyền quản trị!",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    res.json({
      code: 401,
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
    return;
  }
};
