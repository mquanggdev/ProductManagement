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
// [get]/admin/products-category/edit/:id
module.exports.edit = async (req , res) => {
    try{
        const id = req.params.id ;

        const productsCategory = await ProductCategory.findOne({
            _id:id,
            deleted:false
        })
        let find = {
            deleted: false
        }
        const records = await ProductCategory.find(find);
        const newRecords = createTreeHelper(records);

        if(productsCategory){
            res.render("admin/pages/products-category/edit.pug" , {
                pageTitle: "Sửa danh mục sản phẩm",
                productsCategory:productsCategory,
                records:newRecords
            })
        }
        else{
            res.redirect(`${systemConfig.prefixAdmin}/products-category`)
        }
    }catch(e){
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
}

// [patch]/admin/products-category/edit:id
module.exports.editPatch = async (req , res) => {
    try{
        const id = req.params.id;
        if (req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        else{
            const coutProducts = await ProductCategory.countDocuments({});
            req.body.position = coutProducts + 1;
        }
        await ProductCategory.updateOne({
            _id:id
        },req.body);
        req.flash("success","Thêm danh mục thành công")
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
    catch(e){
        req.flash("error ", "Sửa thất bại")
        console.log(e);
    }
    
}

//[get]/admin/products-category/detail/:id
module.exports.detail = async (req,res) => {
    const id = req.params.id;
    let find = {
        _id : id,
        deleted: false
    }
    const records = await ProductCategory.findOne(find);
    console.log(records);
    let titleParent = "";
    const parent_id = records.parent_id ;
    if(parent_id){
        const categoryParent = await ProductCategory.findOne({
            _id : parent_id
        });
        titleParent = categoryParent.title
    }
    res.render("admin/pages/products-category/detail.pug" , {
        pageTitle : "Thêm danh mục sản phẩm " ,
        records : records,
        titleParent:titleParent
    });
    
}