const Product = require("../../model/product.model")
//[GET]/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status:"active",
        deleted:false
    });
    for (const item of products) {
        item.newPrice = (item.price - (item.price * item.discountPercentage / 100) ).toFixed(0);
    }
    res.render("client/pages/products/index.pug" , {
        pageTitle :"Trang Sản Phẩm",
        products : products
    });
}
// [POST]/products/add
module.exports.add = (req, res) => {
    res.send("Trang thêm sản phẩm");
}
module.exports.edit = (req, res) => {
    res.send("Trang sửa sản phẩm");
}