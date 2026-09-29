const Users = require("../../../../models/user.model");
const bcrypt = require("bcrypt");

//[GET] /api/admin/users
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    //search
    if (req.query.keyword) {
      const keywordRegex = new RegExp(req.query.keyword, "i");

      find.$or = [{ fullName: keywordRegex }, { email: keywordRegex }];
    }
    //search

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

    const totalUsers = await Users.countDocuments(find);

    const totalPages = Math.ceil(totalUsers / limit);
    //pagination

    const users = await Users.find(find)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        users,
        pagination: {
          currentPage: page,
          limit,
          totalUsers,
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

//[GET] /api/admin/users/:userId
module.exports.detail = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findOne({
      _id: userId,
      deleted: false,
    }).select("-password");

    if (!user) {
      return res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        user,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/admin/users
module.exports.create = async (req, res) => {
  try {
    const existUser = await Users.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (existUser) {
      return res.json({
        code: 400,
        message: "Email đã được sử dụng",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone ? req.body.phone : "",
      roleId: req.body.roleId ? req.body.roleId : "",
    });
    await user.save();
    res.json({
      code: 200,
      message: "Thêm người dùng thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thêm người dùng thất bại!",
    });
  }
};

//[PATCH] /api/admin/users/:userId
module.exports.edit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findOne({
      _id: userId,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
    }
    const existUser = await Users.findOne({
      email: req.body.email,
      _id: { $ne: userId },
      deleted: false,
    });
    if (existUser) {
      return res.json({
        code: 400,
        message: "Email đã được sử dụng!",
      });
    }
    await Users.updateOne(
      {
        _id: userId,
      },
      req.body,
    );

    res.json({
      code: 200,
      message: "Cập nhật thông tin người dùng thành công!",
      data: {
        user,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật thông tin người dùng thất bại!",
    });
  }
};

//[DELETE] /api/admin/users/:userId
module.exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findOne({
      _id: userId,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
    }
    user.deleted = true;
    await user.save();
    res.json({
      code: 200,
      message: "Xoá người dùng thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá người dùng thất bại!",
    });
  }
};

//[PATCH] /api/admin/users/:userId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findOne({
      _id: userId,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
    }
    const { status } = req.body;
    user.status = status;
    await user.save();
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

//[PATCH] /api/admin/users/:userId/reset-password
module.exports.resetPassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findOne({
      _id: userId,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.updateOne(
      {
        _id: userId,
      },
      {
        password: hashedPassword,
      },
    );
    res.json({
      code: 200,
      message: "Đặt lại mật khẩu thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Đặt lại mật khẩu thất bại",
    });
  }
};
