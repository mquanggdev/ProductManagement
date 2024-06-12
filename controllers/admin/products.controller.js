const Product = require("../../model/product.model");
const paginationHelper = require("../../helper/pagination.helper");
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
        .skip(pagination.skip);

    res.render("admin/pages/products/index.pug" , {
        pageTitle : "Trang Admin Sản Phẩm " , 
        products : products,
        keyword : keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
}
//[get] /admin/products/change-status/:id
module.exports.changeStatus = async (req , res) => {
    // console.log(req.params) // tất cả các biến động thì sẽ được lưu vào thằng params
    const {id,statusChange} = req.params;
    await Product.updateOne({
        _id : id
    },{
        status: statusChange
    }) // obj đầu tiên là thông tin bản ghi cần thay thế , obj2 là cái mà ta sẽ thay thế
    res.redirect("back"); // chuyển hướng sang đường dẫn này - khác hẳn với render : trong trường hợp này ta chỉ thay đổi trạng thái nên ta sẽ ở nguyên trang đó => dùng back
}