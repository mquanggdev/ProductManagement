//[GET]/products
module.exports.index = (req, res) => {
    res.render("client/pages/products/index.pug" , {
        pageTitle :"Trang Sản Phẩm"
    });
}
// [POST]/products/add
module.exports.add = (req, res) => {
    res.send("Trang thêm sản phẩm");
}
module.exports.edit = (req, res) => {
    res.send("Trang sửa sản phẩm");
}