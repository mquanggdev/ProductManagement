
// GET /admin/profile
module.exports.index = (req , res) =>{
    res.render("admin/pages/profiles/index.pug",{
        pageTitle: "Trang thông tin cá nhân"
    });
}