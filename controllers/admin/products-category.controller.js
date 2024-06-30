const ProductCategory = require("../../model/products-category.model");
const systemConfig = require("../../config/system");



//GET /admin/products-category
module.exports.index = async (req,res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    if(records){
            res.render("admin/pages/products-category/index.pug" , {
            pageTitle : "Trang danh mục sản phẩm " , 
            records:records
        });
    }else{
        res.redirect("back");
    }
    
}
//GET /admin/products-category/create
module.exports.create = async (req,res) => {
    
    res.render("admin/pages/products-category/create.pug" , {
        pageTitle : "Thêm danh mục sản phẩm " , 
    });
}

// [post]/admin/products-category/createPost
module.exports.createPost = async (req , res) => {
    if (req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    else{
        const coutProducts = await ProductCategory.countDocuments({});
        req.body.position = coutProducts + 1;
    }
    const newProductCategory = new ProductCategory(req.body);
    await newProductCategory.save();
    req.flash("success","Thêm danh mục thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}