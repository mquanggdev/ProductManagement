const Product = require("../../model/product.model");
//GET /admin/products
module.exports.index = async (req,res) => {
    const products = await Product.find({
        deleted : false
    });
    res.render("admin/pages/products/index.pug" , {
        pageTitle : "Trang Admin Sản Phẩm " , 
        products : products
    });
}