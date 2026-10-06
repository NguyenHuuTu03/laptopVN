const Roles = require("../../../../models/role.model");
const Users = require("../../../../models/user.model");

//[GET] /api/admin/roles
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    //search
    if (req.query.keyword) {
      const keywordRegex = new RegExp(req.query.keyword, "i");
      find.title = keywordRegex;
    }
    //search

    //filter
    if (req.query.status) {
      find.status = req.query.status;
    }
    //filter

    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const totalRoles = await Roles.countDocuments(find);
    const totalPages = Math.ceil(totalRoles / limit);
    //pagination
    const roles = await Roles.find(find)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    for (const role of roles) {
      role.userCount = await Users.countDocuments({
        roleId: role._id,
        deleted: false,
        status: "active",
      });
    }
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        roles,
        pagination: {
          currentPage: page,
          limit,
          totalRoles,
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

//[GET] /api/admin/roles/:rolesId
module.exports.detail = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await Roles.findOne({
      _id: roleId,
    });
    if (!role) {
      return res.json({
        code: 404,
        message: "Không tìm thấy vai trò!",
      });
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        role,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/admin/roles
module.exports.create = async (req, res) => {
  try {
    const roleName =
      req.body.title.charAt(0).toUpperCase() +
      req.body.title.slice(1).toLowerCase();
    req.body.title = roleName;
    const exitsRole = await Role.findOne({
      deleted: false,
      title: req.body.title,
    });
    if (exitsRole) {
      return res.json({
        code: 400,
        message: "Vai trò đã tồn tại",
      });
    }
    const role = new Roles(req.body);
    await role.save();

    res.json({
      code: 200,
      message: "Thêm vai trò thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[PATCH] /api/admin/roles/:roleId
module.exports.edit = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const roleName =
      req.body.title.charAt(0).toUpperCase() +
      req.body.title.slice(1).toLowerCase();
    req.body.title = roleName;

    const exitRole = await Role.findOne({
      deleted: false,
      title: req.body.title,
      _id: { $ne: roleId },
    });
    if (exitRole) {
      return res.json({
        code: 400,
        message: "Vai trò đã tồn tại!",
      });
    }
    await Roles.updateOne({ _id: roleId }, req.body);
    res.json({
      code: 200,
      message: "Cập nhật vai trò thành công!",
      data: {
        roles,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật vai trò thất bại!",
    });
  }
};

//[PATCH] /api/admin/roles/:roleId/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await Roles.findOne({
      _id: roleId,
      deleted: false,
    });
    if (!role) {
      return res.json({
        code: 404,
        message: "Không tìm thấy vai trò!",
      });
    }
    role.status = req.body.status;
    await role.save();
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

//[DELETE] /api/admin/roles/:roleId
module.exports.delete = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await Roles.findOne({
      _id: roleId,
      deleted: false,
    });
    if (!role) {
      return res.json({
        code: 404,
        message: "Không tìm thấy vai trò!",
      });
    }
    role.deleted = true;
    await role.save();
    res.json({
      code: 200,
      message: "Xoá vai trò thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Xoá vai trò thất bại!",
    });
  }
};

//[PATCH] /api/admin/roles/permission
module.exports.permission = async (req, res) => {
  try {
    for (const item of req.body) {
      await Role.updateOne(
        {
          _id: item.id,
        },
        {
          permissions: item.permissions,
        },
      );
    }
    res.json({
      code: 200,
      message: "Phân quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Phân quyền thất bại!",
    });
  }
};
