const Product = require("../../model/product.model")
const ProductCategory = require("../../model/products-category.model");
//[GET]/products
module.exports.index = async (req, res) => {
    const products = await Product
    .find({
        status:"active",
        deleted:false
    })
    .sort({
        position : "desc"
    })
    for (const item of products) {
        item.newPrice = (item.price - (item.price * item.discountPercentage / 100) ).toFixed(0);
    }
    res.render("client/pages/products/index.pug" , {
        pageTitle :"Trang Sản Phẩm",
        products : products
    });
}
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;
  
    const category = await ProductCategory.findOne({
      slug: slugCategory,
      status: "active",
      deleted: false
    });
  
    const allSubCategory = [];
  
    const getSubCategory = async (currentId) => {
      const subCategory = await ProductCategory.find({
        parent_id: currentId,
        status: "active",
        deleted: false
      });
  
      for (const sub of subCategory) {
        allSubCategory.push(sub.id);
        await getSubCategory(sub.id);
      }
    }
  
    await getSubCategory(category.id);
  
    const products = await Product
      .find({
        product_category_id: {
          $in: [
            category.id,
            ...allSubCategory
          ]
        },
        status: "active",
        deleted: false
      })
      .sort({
        position: "desc"
      });
  
    for (const item of products) {
      item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }
  
    // console.log(products);
  
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: products
    });
  }
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug:slug,
            deleted:false,
            status:"active"
        })
        res.render("client/pages/products/detail.pug" , {
            pageTitle :"Trang Sản Phẩm",
            product : product
        });
    } catch (error) {
        res.redirect("/")
    }
   
}