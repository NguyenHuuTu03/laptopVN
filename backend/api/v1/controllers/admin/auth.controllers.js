const Users = require("../../../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateHelpers = require("../../../../helpers/generate");
const ForgotPassword = require("../../../../models/forgot-password.model");
const sendMailHelpers = require("../../../../helpers/sendMail");
const Roles = require("../../../../models/role.model");

//[POST] /api/admin/auth/login
module.exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({
      email: req.body.email,
      deleted: false,
      status: "active",
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!checkPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu không đúng!",
      });
      return;
    }
    if (user.roleId) {
      const role = await Roles.findOne({
        _id: user.roleId,
        deleted: false,
      });
      if (role && role.title === "User") {
        return res.json({
          code: 400,
          message: "Tài khoản không có quyền truy cập!",
        });
      }
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      code: 200,
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng nhập thất bại!",
    });
  }
};

//[POST] /api/admin/auth/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.json({
      code: 200,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server!",
    });
  }
};

//[GET] /api/admin/auth/profile
module.exports.profile = async (req, res) => {
  try {
    const user = await Users.findOne({
      _id: req.userId,
      deleted: false,
      status: "active",
    })
      .select("-password")
      .lean();

    const role = await Roles.findOne({
      _id: user.roleId,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
      return;
    }
    user.role = role;

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        user,
        // user: {
        //   fullName: user.fullName,
        //   email: user.email,
        //   phone: user.phone ? user.phone : "",
        //   address: user.address ? user.address : "",
        //   avatar: user.avatar ? user.avatar : "",
        // },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

//[POST] /api/admin/auth/forgot-password
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOne({
      deleted: false,
      status: "active",
      email: email,
    });
    if (!user) {
      res.json({
        code: 404,
        message: "Email không tồn tại!",
      });
      return;
    }
    if (!user.roleId) {
      return res.json({
        code: 403,
        message: "Tài khoản không có quyền quản trị!",
      });
    }

    const otp = generateHelpers.generateRandomNumber(6);

    const forgot = new ForgotPassword({
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    await forgot.save();

    const subject = "Mã OTP xác minh mật khẩu";
    const html = `Nhập mã OTP ${otp} để xác minh mật khẩu. Vui lòng không cung cấp OTP cho bất kỳ ai.`;

    const sendMail = sendMailHelpers.sendMail(email, subject, html);

    res.json({
      code: 200,
      message: "Gửi OTP thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server!",
    });
  }
};

//[POST] /api/users/verify-otp
module.exports.verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email;
    const forgot = await ForgotPassword.findOne({
      email: email,
      isVerified: false,
    });

    if (!forgot) {
      res.json({
        code: 404,
        message: "Không tìm thấy yêu cầu xác thực OTP!",
      });
      return;
    }

    if (new Date() > forgot.expireAt) {
      res.json({
        code: 400,
        message: "Mã OTP đã hết hạn!",
      });
      return;
    }

    if (otp !== forgot.otp) {
      res.json({
        code: 400,
        message: "Mã OTP không chính xác",
      });
      return;
    }

    forgot.isVerified = true;
    await forgot.save();

    res.json({
      code: 200,
      message: "Xác minh mã OTP thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};

//[POST] /api/users/reset-password
module.exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      return res.json({
        code: 400,
        message: "Mật khẩu nhập lại không chính xác!",
      });
    }

    const forgot = await ForgotPassword.findOne({
      email: email,
      isVerified: true,
    });

    if (!forgot) {
      return res.json({
        code: 400,
        message: "Bạn chưa xác minh mã OTP!",
      });
    }

    const user = await Users.findOne({
      email: email,
      deleted: false,
      status: "active",
    });

    if (!user) {
      res.json({
        code: 404,
        message: "Không tìm thấy tài khoản!",
      });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu mới trùng với mật khẩu hiện tại!",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    await user.save();

    await ForgotPassword.deleteOne({
      _id: forgot.id,
    });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Đổi mật khẩu thất bại!",
    });
  }
};
