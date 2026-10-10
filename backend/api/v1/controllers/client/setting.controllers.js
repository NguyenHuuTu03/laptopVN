const Settings = require("../../../../models/setting.model");

//[GET] api/settings
module.exports.index = async (req, res) => {
  try {
    const setting = await Settings.findOne({
      deleted: false,
    });
    if (!setting) {
      return res.json({
        code: 404,
        message: "Không tìm thấy dữ liệu!",
      });
    }
    res.json({
      code: 200,
      message: "Thành công!",
      data: {
        setting,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thất bại!",
    });
  }
};
