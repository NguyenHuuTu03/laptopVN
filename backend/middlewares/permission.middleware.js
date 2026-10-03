const Roles = require("../models/role.model");

module.exports.requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const role = await Roles.findOne({
        _id: req.user.roleId,
        deleted: false,
        status: "active",
      });

      if (!role) {
        return res.json({
          code: 403,
          message: "Không tìm thấy quyền của tài khoản!",
        });
      }

      if (!role.permissions.includes(permission)) {
        return res.json({
          code: 403,
          message: "Bạn không có quyền thực hiện chức năng này!",
        });
      }

      req.role = role;

      next();
    } catch (error) {
      console.log("PERMISSION ERROR:", error);

      return res.json({
        code: 500,
        message: "Lỗi server!",
      });
    }
  };
};
