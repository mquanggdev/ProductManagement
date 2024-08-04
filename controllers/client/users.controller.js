const User = require("../../model/users.model");
const md5 = require("md5");
const generateHelper = require("../../helper/generate.help");


// [GET] /users/register
module.exports.register = async (req, res) => {
    res.render("client/pages/users/register.pug", {
      pageTitle: "Trang đăng kí tài khoản",
    });
  }
// [Post] /users/register
module.exports.registerPost = async (req, res) => {
  const existUser = await User.findOne({
    email : req.body.email ,
    deleted :false
  })
  if(existUser){
    req.flash("error" , "Emaill đã tồn tại!");
    res.redirect("back");
    return;
  }
  const userData = {
    fullname: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    tokenUser: generateHelper.generateRandomString(30)
  };
  const user = new User(userData);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
}

// [GET] /users/login
module.exports.login = async (req, res) => {
  res.render("client/pages/users/login.pug", {
    pageTitle: "Trang đăng nhập tài khoản",
  });
}
// [Post] /users/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email : req.body.email,
    deleted : false
  })
  if(!user){
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if(md5(req.body.password) != user.password){
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if(user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/users/login");
};