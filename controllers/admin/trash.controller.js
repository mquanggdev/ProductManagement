const Product = require("../../model/product.model");
const ProductCategory = require("../../model/products-category.model");
const Account = require("../../model/accounts.model");
const User = require("../../model/users.model");
const Role = require("../../model/roles.model");
const paginationHelper = require("../../helper/pagination.helper");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree.helper");

// [GET] /admin/trash
module.exports.index = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
    const productCount = await Product.countDocuments({
        deleted:true
    })
    const productCategoryCount = await ProductCategory.countDocuments({
        deleted:true
    })
    const accountCount = await Account.countDocuments({
        deleted:true
    })
    const userCount = await User.countDocuments({
        deleted:true
    })
    const roleCount = await Role.countDocuments({
        deleted:true
    })
    const arrayRecords = [
        {
            name : "Sản Phẩm",
            count : productCount,
            link : `/${systemConfig.prefixAdmin}/trash/products`
        },
        {
            name : "Danh Mục Sản Phẩm",
            count : productCategoryCount,
            link : `/${systemConfig.prefixAdmin}/trash/products-category`
        },
        {
            name : "Nhóm Quyền",
            count : roleCount,
            link : `/${systemConfig.prefixAdmin}/trash/roles`
        },
        {
            name : "Tài Khoản Quản Lý",
            count : accountCount,
            link : `/${systemConfig.prefixAdmin}/trash/accounts`
        },
        {
            name : "Tài Khoản Người Dùng",
            count : userCount,
            link : `/${systemConfig.prefixAdmin}/trash/users`
        },

    ] ;

    
    res.render("admin/pages/trash/index.pug" , {
        pageTitle: "Trang thùng rác",
        arrayRecords : arrayRecords
    });
}else{return;}
}
// [GET] /admin/trash/products
module.exports.products = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
    const products = await Product.find({
        deleted : true
    })
    const pagination  = await paginationHelper(req , {
        deleted:true
    })
    if(products){    
        for (const product of products) {  
            const userDeleted = await Account.findOne({
                _id : product.deleteBy.account_id
            })
            
            
            if(userDeleted){
                product.deleteBy.userDeletedFullName = userDeleted.fullname ;
            }
        }
    }
    res.render("admin/pages/trash/products" , {
        pageTitle : "Sản phẩm đã xóa" ,
        products : products,
        pagination : pagination,
        nameRecord : "products"
    }) ;
}else{
    return;
}
}
// [GET] /admin/trash/products-category
module.exports.productsCategory = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
    const productsCategory = await ProductCategory.find({
        deleted : true
    })
    const pagination = await paginationHelper.pagination(req , {
        deleted:true
    } , ProductCategory)
    if(productsCategory){    
        for (const productcategory of productsCategory) {  
            const userDeleted = await Account.findOne({
                _id : productcategory.deleteBy.account_id
            })
            
            
            if(userDeleted){
                productcategory.deleteBy.userDeletedFullName = userDeleted.fullname ;
            }
        }
    }
    res.render("admin/pages/trash/products-category" , {
        pageTitle : "Danh mục đã xóa" ,
        records : productsCategory,
        pagination : pagination,
        nameRecord : "products-category"
    }) ;
}
    else{
        return;
    }
}
// [GET] /admin/trash/roles
module.exports.roles = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
    const roles = await Role.find({
        deleted : true
    })
    const pagination = await paginationHelper.pagination(req , {
        deleted:true
    } , Role)
    res.render("admin/pages/trash/roles" , {
        pageTitle : "Nhóm quyền đã xóa" ,
        records : roles,
        pagination : pagination,
        nameRecord : "roles"
    }) ;
}else{
    return;
}
}
// [GET] /admin/trash/accounts
module.exports.accounts = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
    const accounts = await Account.find({
        deleted : true
    })
    const pagination = await paginationHelper.pagination(req , {
        deleted:true
    } , Account)

    for(const account of accounts) {
        const roles = await Role.findOne({
            _id : account.role_id
        });
        account.roleTitle = roles.title ;
    }
    res.render("admin/pages/trash/accounts" , {
        pageTitle : "Tài khoản quản lý đã xóa" ,
        records : accounts,
        pagination : pagination,
        nameRecord : "accounts"
    }) ;
}else{return;}
}
// [GET] /admin/trash/users
module.exports.users = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_view")){
       const users = await User.find({
        deleted : true
    })
    const pagination = await paginationHelper.pagination(req , {
        deleted:true
    } , User)
    res.render("admin/pages/trash/users" , {
        pageTitle : "Tài khoản người dùng đã xóa" ,
        records : users,
        pagination : pagination,
        nameRecord : "users"
    }) ;
}else{return;}
}

// [PATCH] /admin/trash/product/restore
module.exports.restore = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_restore")){
    const ids = req.body ;
    const nameRecord = req.params.record;
    switch (nameRecord) {
        case "products":
            await Product.updateMany({
                _id : ids
            } , {
                deleted : false
            })
            break;
        case "products-category":
            await ProductCategory.updateMany({
                _id : ids
            } , {
                deleted : false
            })
            break;
        case "roles":
            await Role.updateMany({
                _id : ids
            } , {
                deleted : false
            })
            break;
        case "accounts":
            await Account.updateMany({
                _id : ids
            } , {
                deleted : false
            })
            break;
        case "users":
            await User.updateMany({
                _id : ids
            } , {
                deleted : false
            })
            break;
        default:
            break;
    }
     
     
    res.json({
        code:"200"
    })
}else{
    return;
}
}
// [PATCH] /admin/trash/product/deletePermanent
module.exports.deletePermanent = async (req ,res) => {
    if(res.locals.role.permissions.includes("trash_deletePermanent")){
    const ids = req.body ;
    const nameRecord = req.params.record;
    switch (nameRecord) {
        case "products":
            await Product.deleteMany({
                _id : ids
            })
            break;
        case "products-category":
            await ProductCategory.deleteMany({
                _id : ids
            })
            break;
        case "roles":
            await Role.deleteMany({
                _id : ids
            })
            break;
        case "accounts":
            await Account.deleteMany({
                _id : ids
            })
            break;
        case "users":
            await User.deleteMany({
                _id : ids
            })
            break;
        default:
            break;
    }
    
   res.json({
       code:"200"
   })
}else{
    return;
}
}

