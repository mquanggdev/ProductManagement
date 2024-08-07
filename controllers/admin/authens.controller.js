const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
var md5 = require('md5');

//GET /admin/authens/login
module.exports.login = async (req,res) => {
    res.render("admin/pages/authens/login.pug" , {
        pageTitle : "Trang đăng nhập " , 
    });
}

// [POST] /admin/authens/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error","Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) !== user.password){
        req.flash("error" , "Không đúng mật khẩu");
        res.redirect("back");
        return;
    }

    if(user.status === "inactive"){
        req.flash("error","Tài khoản đang bị khóa");
        res.redirect("back");
        return;
    }
    res.cookie("token", user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  };
// [GET] /admin/authen/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/authens/login`);
}