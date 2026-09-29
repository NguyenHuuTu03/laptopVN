const Setting = require("../../../../models/setting.model");

//[GET] /api/admin/settings/general
module.exports.general = async (req, res) => {
  try {
    const setting = await Setting.findOne({
      deleted: false,
    });
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
      message: "Thất bại",
    });
  }
};

//[PATCH] /api/admin/settings/general
module.exports.updateGeneral = async (req, res) => {
  try {
    if (req.body.logo) {
      req.body.logo = req.body.logo[0];
    }
    await Setting.updateOne(
      {
        deleted: false,
      },
      req.body,
    );
    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật thất bại!",
    });
  }
};
