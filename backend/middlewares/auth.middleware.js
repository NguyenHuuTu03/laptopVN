const jwt = require("jsonwebtoken");

module.exports.requireAuth = (req, res, next) => {
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
