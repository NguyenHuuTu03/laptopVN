const Users = require("../../../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateHelpers = require("../../../../helpers/generate");
const ForgotPassword = require("../../../../models/forgot-password.model");
const sendMailHelpers = require("../../../../helpers/sendMail");

//[GET] /api/users/register
module.exports.register = async (req, res) => {
  try {
    const exitsEmail = await Users.findOne({
      deleted: false,
      status: "active",
      email: req.body.email,
    });

    if (exitsEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Users({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      code: 200,
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng ký thất bại!",
    });
  }
};

//[POST] /api/login
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

//[POST] /api/users/logout
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

//[GET] /api/users/profile
module.exports.profile = async (req, res) => {
  try {
    const user = await Users.findOne({
      _id: req.userId,
      deleted: false,
      status: "active",
    }).select("-password");

    if (!user) {
      res.json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
      return;
    }

    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ? user.phone : "",
          address: user.address ? user.address : "",
          avatar: user.avatar ? user.avatar : "",
        },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

//[POST] /api/users/forgot-password
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
        code: 401,
        message: "Email không tồn tại!",
      });
      return;
    }

    const otp = generateHelpers.generateRandomNumber(6);

    const forgot = new ForgotPassword({
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
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
    const email = req.query.email;
    const forgot = await ForgotPassword.findOne({
      email: email,
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
    const email = req.query.email;
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

//[PATCH] /api/users/change-password
module.exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await Users.findOne({
      _id: userId,
      deleted: false,
      status: "active",
    });

    if (!user) {
      res.json({
        code: 404,
        message: "Không tìm thấy tài khoản người dùng!",
      });
      return;
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu nhập lại không chính xác!",
      });
      return;
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu hiện tại không chính xác!",
      });
      return;
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      res.json({
        code: 400,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ!",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

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

//[PATCH] /api/users/profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { fullName, phone, address, avatar } = req.body;

    const user = await Users.findOne({
      _id: userId,
    }).select("-password");

    if (!user) {
      res.json({
        code: 404,
        message: "Không tìm thấy tài khoản!",
      });
      return;
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (phone) {
      user.phone = phone;
    }

    if (address) {
      user.address = address;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      code: 200,
      message: "Cập nhật thông tin thành công",
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật thông tin thất bại",
    });
  }
};
