const Product = require("../../model/product.model");
const Account = require("../../model/accounts.model");
const ProductCategory = require("../../model/products-category.model");
const createTreeHelper = require("../../helper/createTree.helper");
const paginationHelper = require("../../helper/pagination.helper");
const systemConfig = require("../../config/system");
//GET /admin/products
module.exports.index = async (req,res) => {
    if(res.locals.role.permissions.includes("products_view")){
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
        ] 
        const find = {
            deleted : false
        };
        //  trạng thái
        if(req.query.status) {
            find.status = req.query.status;
          }
        // end  trạng thái
        
        // tìm kiếm
        var keyword = "" ;
        if (req.query.keyword){
            const regex = new RegExp(req.query.keyword, "i"); // không phân biệt hoa thường. thì biến thứ 2 thêm "i"
            find.title = regex;
            keyword = req.query.keyword
        }
        // end tìm kiếm
    
    
        // Phân trang
        const pagination = await paginationHelper(req ,find);
         // end Phân trang
    
         // sort
         let sort = {}
         if (req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue
         }else{
            sort.position = "desc"
         }
         // end sort
        const products = await Product
            .find(find)
            .limit(pagination.limitItems)
            .skip(pagination.skip)
            .sort(sort);
    
    
            for (const product of products) {
                const userCreate = await Account.findOne({
                    _id : product.createBy.account_id
                });
                if(userCreate){
                    product.createBy.accountFullName = userCreate.fullname;
                }
    
    
                const userEdit = await Account.findOne({
                    _id : product.updateBy.account_id
                })
                if(userEdit){
                    product.updateBy.userEditFullName = userEdit.fullname;
                }            
            }
    
            
            
            
    
        res.render("admin/pages/products/index.pug" , {
            pageTitle : "Trang Admin Sản Phẩm " , 
            products : products,
            keyword : keyword,
            filterStatus: filterStatus,
            pagination: pagination
        });
    }else{
        return;
    }
    
}
//[Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req , res) => {
    if(res.locals.role.permissions.includes("products_edit")){
    // console.log(req.params) // tất cả các biến động thì sẽ được lưu vào thằng params
    const {id,statusChange} = req.params; // thằng này thì lấy thẳng từ link
    const updateBy = {
        account_id : res.locals.user.id,
        updateAt : new Date()
    }
    await Product.updateOne({
        _id : id
    },{
        status: statusChange,
        updateBy:updateBy
    }) // obj đầu tiên là thông tin bản ghi cần thay thế , obj2 là cái mà ta sẽ thay thế
    
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.json({ // thằng này là thằng mà ta muốn gửi khi mà ta fetch link
        code : 200
    });
 }else{
    return;
 }
}
//[Patch] /admin/products/change-multi
module.exports.changeMulti = async (req , res) => {
    if(res.locals.role.permissions.includes("products_edit")){
        const {status,ids} = req.body; // thằng này lấy từ body về
        const personUpdate = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        switch (status) {
            case "active":
            case "inactive":
                await Product.updateMany({
                        _id : ids
                    },{
                        status: status,
                        updateBy:personUpdate
                })
                break;
            case "delete" :
                await Product.updateMany({
                        _id : ids
                    },{
                        deleted: true,
                        deleteBy:{
                            account_id : res.locals.user.id,
                            deletedAt : new Date()
                        }
                })
                break;
            default:
                break;
        }
        res.json({
            code : 200
        });
    }else{
        return;
    }
}
//[patch] /admin/products/delete:id
module.exports.deleteItem = async (req , res) => {
    if(res.locals.role.permissions.includes("products_delete")){
    const id = req.params.id;
    await Product.updateOne({
        _id : id
    } , {
        deleted : true, 
        deleteBy:{
            account_id : res.locals.user.id,
            deletedAt : new Date()
        }
    })
    req.flash("success" , "Xóa sản phẩm thành công")
    res.json({
        code : 200
    });
 }else{
    return;
 }
}
//[patch] /admin/products/change-position
module.exports.changePosition = async (req , res) => {
    if(res.locals.role.permissions.includes("products_view")){
    const id = req.params.id;
    const position = req.body.position;
    const personUpdate = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Product.updateOne({
        _id : id
    } , {
        position : position,
        updateBy:personUpdate
    }) 
    res.json({
        code : 200
    });
}else{
    return;
}
}
// [get]/admin/product/create
module.exports.create = async (req , res) => {
    if(res.locals.role.permissions.includes("products_create")){
    const category = await ProductCategory.find({
        deleted:false
    })
    const product = await Product.find({
        deleted:false
    })
    const newCategory = createTreeHelper(category);
    res.render("admin/pages/products/create.pug" , {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory,
        product:product
    })
}else{
    return;
}
}
// [post]/admin/product/createPost
module.exports.createPost = async (req , res) => {
    if(res.locals.role.permissions.includes("products_create")){
        req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    else{
        const coutProducts = await Product.countDocuments({});
        req.body.position = coutProducts + 1;
    }
    
    req.body.createBy = {
        account_id : res.locals.user.id,
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }else{
        return;
    }
    
}

// [get]/admin/product/edit/:id
module.exports.edit = async (req , res) => {
    if(res.locals.role.permissions.includes("products_edit")){

    try{
        const id = req.params.id ;

        const product = await Product.findOne({
        _id:id,
        deleted:false 
        })
        const category = await ProductCategory.find({
            deleted:false
        })
        const newCategory = createTreeHelper(category);

        if(product){
            res.render("admin/pages/products/edit.pug" , {
                pageTitle: "Sửa sản phẩm",
                product:product,
                category:newCategory
            })
        }
        else{
            res.redirect(`${systemConfig.prefixAdmin}/products`)
        }
    }catch(e){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    }else{
        return;
    }    
}
// [patch]/admin/product/edit/:id
module.exports.editPatch = async (req , res) => {
    if(res.locals.role.permissions.includes("products_view")){

    try{
        const id = req.params.id
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        else{
            const coutProducts = await Product.countDocuments({});
            req.body.position = coutProducts + 1;
        }

        const personUpdate = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        
        await Product.updateOne({
            _id: id,
            deleted: false
        }, {
            ...req.body,
            updateBy:personUpdate
        });
        req.flash("success", "Cập nhật sản phẩm thành công!");
    }catch(err){
        req.flash("error","Id sản phẩm không hợp lệ")
    }
    res.redirect(`back`);
}else{
    return;
}
}
//[get]/admin/detail/:id
module.exports.detail = async (req , res) => {
    if(res.locals.role.permissions.includes("products_view")){

    try{
        const id = req.params.id ;

        const product = await Product.findOne({
        _id:id
        })

        if(product){
            res.render("admin/pages/products/detail.pug" , {
                pageTitle: "Chi tiết sản phẩm",
                product:product
            })
        }
        else{
            res.redirect(`${systemConfig.prefixAdmin}/products`)
        }
    }catch(e){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}else{
    return;
}
}




