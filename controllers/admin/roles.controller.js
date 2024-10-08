const Role = require("../../model/roles.model");
const systemConfig = require("../../config/system");

//GET /admin/roles
module.exports.index = async (req,res) => {
if(res.locals.role.permissions.includes("roles_view")){

    const records = await Role.find({
        deleted:false
    })
    res.render("admin/pages/roles/index.pug" , {
        pageTitle : "Trang Nhóm Quyền " , 
        records:records,
    });
}else{
    return;
}
}

//GET /admin/roles/permissions
module.exports.indexPermissions = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_permissions")){
    const records = await Role.find({
        deleted:false
    })
    res.render("admin/pages/roles/permissions.pug" , {
        pageTitle : "Trang Phân Quyền " , 
        records:records,
    });
}else{
    return;
}
}

//Patch /admin/roles/permission
module.exports.indexPermissionsPatch = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_permissions")){
    try {
        const roles = JSON.parse(req.body.roles);
        for(var role of roles){
            await Role.updateOne({
                _id: role.id,
                deleted:false
            },{
                permissions : role.permissions
            })
        }
        req.flash("success", "Cập nhật phân quyền thành công!");
        res.redirect("back")
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles/permissions`);
    }
}else{
    return;
}
}

//GET /admin/roles/create
module.exports.create = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_create")){
    res.render("admin/pages/roles/create.pug" , {
        pageTitle : "Trang Tạo Quyền " , 
    });
}else{
    return;
}
}

//Post /admin/roles/create
module.exports.createPost = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_create")){
    const newRole = new Role(req.body);
    await newRole.save();
    req.flash("success","Thêm quyền thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }else{
        return;
    }
}

//GET /admin/roles/edit/:id
module.exports.edit = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_edit")){
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
}else{
    return;
}
}

//GET /admin/roles/edit/:id
module.exports.editPatch = async (req,res) => {
    if(res.locals.role.permissions.includes("roles_edit")){
    try {
        const id = req.params.id ;
        await Role.updateOne({
            _id:id
        },req.body)
        req.flash("success","Thêm quyền thành công")
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}else{
    return;
}
}

//[get]/admin/detail/:id
module.exports.detail = async (req , res) => {
    if(res.locals.role.permissions.includes("roles_view")){
    try{
        const id = req.params.id ;

        const role = await Role.findOne({
            _id:id,
            deleted:false 
        })

        if(role){
            res.render("admin/pages/roles/detail.pug" , {
                pageTitle: "Chi tiết nhóm",
                records:role
            })
        }
        else{
            res.redirect(`${systemConfig.prefixAdmin}/roles`)
        }
    }catch(e){
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }}
    else{
        return ;
    }
}
// [get]/admin/roles/delete/:id
module.exports.delete = async (req , res) => {
    if(res.locals.role.permissions.includes("roles_delete")){
    try{
        const id = req.params.id;
        await Role.updateOne({
            _id:id
        },{
            deleted:true
        });
        req.flash("success","Xóa thành công")
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
    catch(e){
        req.flash("error ", "Sửa thất bại")
        console.log(e);
    }
}else{
    return;
}
}

