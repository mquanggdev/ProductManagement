const Product = require("../../model/product.model");
const paginationHelper = require("../../helper/pagination.helper");
const systemConfig = require("../../config/system");
//GET /admin/products
module.exports.index = async (req,res) => {
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
    const pagination = await paginationHelper(req , find);
    // tìm kiếm
    var keyword = "" ;
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i"); // không phân biệt hoa thường. thì biến thứ 2 thêm "i"
        find.title = regex;
        keyword = req.query.keyword
    }
    // end tìm kiếm


    // Phân trang
    
     // end Phân trang
    const products = await Product
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination.skip)
        .sort({
            position : "desc" // sắp xếp theo giảm dần
        })

    res.render("admin/pages/products/index.pug" , {
        pageTitle : "Trang Admin Sản Phẩm " , 
        products : products,
        keyword : keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
}
//[Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req , res) => {
    // console.log(req.params) // tất cả các biến động thì sẽ được lưu vào thằng params
    const {id,statusChange} = req.params; // thằng này thì lấy thẳng từ link
    await Product.updateOne({
        _id : id
    },{
        status: statusChange
    }) // obj đầu tiên là thông tin bản ghi cần thay thế , obj2 là cái mà ta sẽ thay thế
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.json({ // thằng này là thằng mà ta muốn gửi khi mà ta fetch link
        code : 200
    });
}
//[Patch] /admin/products/change-multi
module.exports.changeMulti = async (req , res) => {
    const {status,ids} = req.body; // thằng này lấy từ body về
    
    switch (status) {
        case "active":
        case "inactive":
            await Product.updateMany({
                    _id : ids
                },{
                    status: status
            })
            break;
        case "delete" :
            await Product.updateMany({
                    _id : ids
                },{
                    deleted: true
            })
            break;
        default:
            break;
    }
    res.json({
        code : 200
    });
}
//[patch] /admin/products/delete:id
module.exports.deleteItem = async (req , res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id : id
    } , {
        deleted : true 
    })
    req.flash("success" , "Xóa sản phẩm thành công")
    res.json({
        code : 200
    });
}
//[patch] /admin/products/change-position
module.exports.changePosition = async (req , res) => {
    const id = req.params.id;
    const position = req.body.position;
    await Product.updateOne({
        _id : id
    } , {
        position : position 
    }) 
    res.json({
        code : 200
    });
}
// [get]/admin/product/create
module.exports.create = async (req , res) => {
    res.render("admin/pages/products/create.pug" , {
        pageTitle: "Thêm mới sản phẩm"
    })
}
// [patch]/admin/product/createPost
module.exports.createPost = async (req , res) => {
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

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}
