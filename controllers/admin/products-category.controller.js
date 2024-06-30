const ProductCategory = require("../../model/products-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree.helper");


//GET /admin/products-category
module.exports.index = async (req,res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper(records);
    if(records){
            res.render("admin/pages/products-category/index.pug" , {
            pageTitle : "Trang danh mục sản phẩm " , 
            records:newRecords
        });
    }else{
        res.redirect("back");
    }
    
}
//GET /admin/products-category/create
module.exports.create = async (req,res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products-category/create.pug" , {
        pageTitle : "Thêm danh mục sản phẩm " ,
        records : newRecords
    });
}

// [post]/admin/products-category/createPost
module.exports.createPost = async (req , res) => {
    console.log(req.body);
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