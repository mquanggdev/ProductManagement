const ProductCategory = require("../../model/products-category.model");
const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree.helper");


//GET /admin/products-category
module.exports.index = async (req,res) => {
    if(res.locals.role.permissions.includes("products-category_view")){

    
    const filterStatus = [
        {
            label: "Tất cả" ,
            value: ""
        },
        {
            label: "Hoạt động" ,
            value: "active"
        },
        {
            label: "Dừng hoạt động" ,
            value: "inactive"
        },
    ];
    const find = {
        deleted: false
    }
    if(req.query.status) {
        find.status = req.query.status;
      }
    var keyword = "" ;
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
        keyword = req.query.keyword
    }
    // phân trang
        const pagination = {
            currentPage : 1, 
            limitItems : 4
          }
          if(req.query.page){
            pagination.currentPage = parseInt(req.query.page);
          }
          pagination.skip = (pagination.currentPage - 1) * pagination.limitItems
          const totalProduct = await ProductCategory.countDocuments(find);
          const totalPage = Math.ceil(totalProduct / pagination.limitItems);
          pagination.total = totalPage;
    // end phân trang
    let sort = {}
    if (req.query.sortKey && req.query.sortValue){
       sort[req.query.sortKey] = req.query.sortValue
    }else{
       sort.position = "desc"
    }
    
    const records = await ProductCategory
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination.skip)
        .sort(sort);
        for (const proCa of records) {
            const userCreate = await Account.findOne({
                _id : proCa.createBy.account_id
            });
            if(userCreate){
                proCa.createBy.accountFullName = userCreate.fullname;
            }


            const userEdit = await Account.findOne({
                _id : proCa.updateBy.account_id
            })
            if(userEdit){
                proCa.updateBy.userEditFullName = userEdit.fullname;
            }            
        }
    const newRecords = createTreeHelper(records);
    if(records){
            res.render("admin/pages/products-category/index.pug" , {
            pageTitle : "Trang danh mục sản phẩm " , 
            records:newRecords,
            keyword : keyword,
            filterStatus: filterStatus,
            pagination: pagination
        });
    }else{
        res.redirect("back");
    }
}else{
    return;
}
    
}
//GET /admin/products-category/create
module.exports.create = async (req,res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products-category/create.pug" , {
        pageTitle : "Thêm danh mục sản phẩm " ,
        records : newRecords
    });
}else{
    return
}
}

// [post]/admin/products-category/createPost
module.exports.createPost = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
    if (req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    else{
        const coutProducts = await ProductCategory.countDocuments({});
        req.body.position = coutProducts + 1;
    }
    req.body.createBy = {
        account_id : res.locals.user.id,
        createAt : new Date(),
    }  
    const newProductCategory = new ProductCategory(req.body);
    await newProductCategory.save();
    req.flash("success","Thêm danh mục thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}else{
    return;
}
}
// [get]/admin/products-category/edit/:id
module.exports.edit = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
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
}else{
    return;
}
}

// [patch]/admin/products-category/edit:id
module.exports.editPatch = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
    try{
        const id = req.params.id;
        if (req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        else{
            const coutProducts = await ProductCategory.countDocuments({});
            req.body.position = coutProducts + 1;
        }
        req.body.updateBy = {
            account_id : res.locals.user.id,
            updateAt : new Date()
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
    }else{
        return;
    }
    
}

//[get]/admin/products-category/detail/:id
module.exports.detail = async (req,res) => {
    if(res.locals.role.permissions.includes("products-category_view")){
    const id = req.params.id;
    let find = {
        _id : id
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
}else{
    return ;
}
    
}

// [get]/admin/products-category/delete/:id
module.exports.delete = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_delete")){
    try{
        const id = req.params.id;
        await ProductCategory.updateOne({
            _id:id
        },{
            deleted:true,
            deleteBy:{
                account_id : res.locals.user.id,
                deletedAt : new Date(),
            }
        });
        req.flash("success","Xóa thành công")
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
    catch(e){
        req.flash("error ", "Sửa thất bại")
        console.log(e);
    }
}else{
    return;
}
    
}

// Get /admin/products-category/changeStatus/:status/:id
module.exports.changeStatus = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
    try {
        const status = req.params.status ;
        const id = req.params.id ;

        await ProductCategory.updateOne({
            _id : id,
        }, {
            status:status,
            updateBy : {
                account_id : res.locals.user.id,
                updateAt : new Date()
            } 
        });
        req.flash("success" , "Cập nhật thành công !") ;
        res.redirect("back");
    } catch (error) {
        req.flash("error" , "Không tìm thấy danh mục sản phẩm!");
        res.redirect("/");
    }
}else{
    return;
}
}
// Get /admin/products-category/changePosition/:id
module.exports.changePosition = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
    try {
        const id = req.params.id ;
        const position = req.body.position
        await ProductCategory.updateOne({
            _id : id,
        }, {
            position:position,
            updateBy : {
                account_id : res.locals.user.id,
                updateAt : new Date()
            } 
        });
        req.flash("success" , "Cập nhật thành công !") ;
        res.json({
            code:200
        });
    } catch (error) {
        req.flash("error" , "Không tìm thấy danh mục sản phẩm!");
        res.redirect("/");
    }
}else{
    return;
}
}
//patch admin/products-category/change-multi
module.exports.changeMulti = async (req , res) => {
    if(res.locals.role.permissions.includes("products-category_edit") && res.locals.role.permissions.includes("products-category_delete") ){
    const {status,ids} = req.body ;
    switch (status) {
        case "active":
        case "inactive":
            await ProductCategory.updateMany({
                _id : ids
            } , {
                status : status,
                updateBy : {
                    account_id : res.locals.user.id,
                    updateAt : new Date()
                } 
            })
            break;
        case "delete":
            await ProductCategory.updateMany({
                _id : ids
            } , {
                deleted:true,
                deleteBy : {
                    account_id : res.locals.user.id,
                    deletedAt : new Date()
                } 
            })
            break;
        default:
            break;
    }
    req.flash("success" , "Cập nhật thành công!");
    res.json({
        code : 200
    });
}else{
    return;
}
}