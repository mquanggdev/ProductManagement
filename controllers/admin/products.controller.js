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
    if(req.query.status) {
        find.status = req.query.status;
      }
    var keyword = "" ;
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i"); // không phân biệt hoa thường. thì biến thứ 2 thêm "i"
        find.title = regex;
        keyword = req.query.keyword
    }
    const products = await Product.find(find);
    res.render("admin/pages/products/index.pug" , {
        pageTitle : "Trang Admin Sản Phẩm " , 
        products : products,
        keyword : keyword,
        filterStatus: filterStatus
    });
}