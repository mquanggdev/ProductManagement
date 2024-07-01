const Role = require("../../model/roles.model");
const systemConfig = require("../../config/system");

//GET /admin/roles
module.exports.index = async (req,res) => {
    const records = await Role.find({
        deleted:false
    })
    res.render("admin/pages/roles/index.pug" , {
        pageTitle : "Trang Nhóm Quyền " , 
        records:records,
    });
}

//GET /admin/roles/create
module.exports.create = async (req,res) => {
    res.render("admin/pages/roles/create.pug" , {
        pageTitle : "Trang Tạo Quyền " , 
    });
}

//Post /admin/roles/create
module.exports.createPost = async (req,res) => {
    const newRole = new Role(req.body);
    await newRole.save();
    req.flash("success","Thêm quyền thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}