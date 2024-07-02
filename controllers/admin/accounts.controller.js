const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
const Role = require("../../model/roles.model");
const generateHelper = require("../../helper/generate.help");
var md5 = require('md5');

//GET /admin/accounts
module.exports.index = async (req,res) => {
    const records = await Account.find({
        deleted:false
    })
    for (const record of records) {
        const role = await Role.findOne({
          _id: record.role_id,
          deleted: false
        });
    
        record.roleTitle = role.title;
      }
    res.render("admin/pages/accounts/index.pug" , {
        pageTitle : "Danh sách tài khoản " , 
        records:records,
    });
}
//GET /admin/accounts/create
module.exports.create = async (req,res) => {
    const roles = await Role.find({
        deleted: false,
      });
    
      res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles
      });
}

//Post /admin/accounts/create
module.exports.createPost = async (req,res) => {
    const password = req.body.password ;
    req.body.password = md5(password);
    req.body.token = generateHelper.generateRandomString(30);

    const account = new Account(req.body);
    await account.save();
    req.flash("success","Thêm quyền thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

//GET /admin/account/edit/:id
module.exports.edit = async (req,res) => {
    try {
        const find = {
          _id: req.params.id,
          deleted: false,
        };
    
        const data = await Account.findOne(find);
    
        const roles = await Role.find({
          deleted: false,
        });
    
        res.render("admin/pages/accounts/edit", {
          pageTitle: "Chỉnh sửa tài khoản",
          data: data,
          roles: roles,
        });
      } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
      }
}

//GET /admin/account/edit/:id
module.exports.editPatch = async (req,res) => {
    try {
        if(req.body.password) {
          req.body.password = md5(req.body.password);
        } else {
          delete req.body.password;
        }
    
        await Account.updateOne({
          _id: req.params.id,
          deleted: false
        }, req.body);
        req.flash("success","Cập nhật thành công")
        res.redirect("back");
       
      } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
      }
}

// //[get]/admin/detail/:id
// module.exports.detail = async (req , res) => {
//     try{
//         const id = req.params.id ;

//         const role = await Role.findOne({
//             _id:id,
//             deleted:false 
//         })

//         if(role){
//             res.render("admin/pages/roles/detail.pug" , {
//                 pageTitle: "Chi tiết nhóm",
//                 role:role
//             })
//         }
//         else{
//             res.redirect(`${systemConfig.prefixAdmin}/roles`)
//         }
//     }catch(e){
//         res.redirect(`/${systemConfig.prefixAdmin}/roles`);
//     }
// }
// // [get]/admin/products-category/delete/:id
// module.exports.delete = async (req , res) => {
//     try{
//         const id = req.params.id;
//         await Role.updateOne({
//             _id:id
//         },{
//             deleted:true
//         });
//         req.flash("success","Xóa thành công")
//         res.redirect(`/${systemConfig.prefixAdmin}/roles`);
//     }
//     catch(e){
//         req.flash("error ", "Sửa thất bại")
//         console.log(e);
//     }
    
// }

