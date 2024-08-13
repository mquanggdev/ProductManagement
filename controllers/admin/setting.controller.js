const Setting = require("../../model/setting.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  if(res.locals.role.permissions.includes("settings_view")){
  const setting = await Setting.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setting: setting
  });
}
  else{
    return ;
  }
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  if(res.locals.role.permissions.includes("settings_edit")){
  const setting = await Setting.findOne({});

  if(setting) {
    await Setting.updateOne({
      _id: setting.id
    }, req.body);
  } else {
    const record = new Setting(req.body);
    await record.save();
  }

  res.redirect("back");
}else{
  return;
}
};