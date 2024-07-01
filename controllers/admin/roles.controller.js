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

//GET /admin/roles/edit/:id
module.exports.edit = async (req,res) => {
    try {
        const id = req.params.id ;
        const records = await Role.findOne({
            _id:id,
            deleted:false
        })
        res.render("admin/pages/roles/edit.pug" , {
            pageTitle : "Trang Sửa Quyền " ,
            records:records 
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}

//GET /admin/roles/edit/:id
module.exports.editPatch = async (req,res) => {
    try {
        const id = req.params.id ;
        await Role.updateOne({
            _id:id
        },req.body)
        req.flash("success","Thêm quyền thành công")
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}