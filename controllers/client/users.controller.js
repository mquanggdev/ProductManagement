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