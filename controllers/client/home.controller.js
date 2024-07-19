const Product = require("../../model/product.model");
// [Get] /
module.exports.index = async (req, res) => {
    const productsFeatured = Product
    .find({
        featured:"1",
        deleted:false,
        status:"active"
    })
    .sort({position:"desc"})
    .limit(6)
    .select("-description")
    for (const item of productsFeatured) {
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
      }

        const productsNew = Product
    .find({
        deleted:false,
        status:"active"
    })
    .sort({position:"desc"})
    .limit(6)
    .select("-description")
    for (const item of productsNew) {
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
      } 
    res.render("client/pages/home/index.pug" , {
        pageTitle : "Trang Chủ",
        productsFeature:productsFeatured,
        productsNew:productsNew
    });
}