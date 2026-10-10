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
    const logo = req.body.logo;
    if (logo) {
      req.body.logo = logo[0];
    }
    const oldSideBar = JSON.parse(req.body.oldSidebar);
    const banner = [];
    if (oldSideBar.length > 0) {
      oldSideBar.forEach((item) => banner.push(item));
    }
    const sideBar = req.body.sideBar;
    if (sideBar) {
      sideBar.forEach((item) => banner.push(item));
    }

    req.body.sideBar = banner;
    await Setting.updateOne(
      {
        deleted: false,
      },
      req.body,
    );

    const setting = await Setting.findOne({
      deleted: false,
    });

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
      data: {
        setting,
      },
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Cập nhật thất bại!",
    });
  }
};
