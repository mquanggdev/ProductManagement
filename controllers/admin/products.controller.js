const Product = require("../../model/product.model");
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
    
    // tìm kiếm
    var keyword = "" ;
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i"); // không phân biệt hoa thường. thì biến thứ 2 thêm "i"
        find.title = regex;
        keyword = req.query.keyword
    }
    // end tìm kiếm


    // Phân trang
    const pagination = {
        currentPage: 1,
        limitItems : 4, // mỗi trang có 4 phần tử
    };
    if (req.query.page){
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * (pagination.limitItems); // bỏ qua bao nhiêu trang
    const allProductFind = await Product.countDocuments(find);
    pagination.totalPage = Math.ceil(allProductFind / pagination.limitItems);
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