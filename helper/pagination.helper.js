const Product = require("../model/product.model");
module.exports = async (req , find) => {
    const pagination = {
        currentPage: 1,
        limitItems : 4, // mỗi trang có 4 phần tử
    };
    if (req.query.page){
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * (pagination.limitItems); // bỏ qua bao nhiêu trang
    const allProductFind = await Product.countDocuments(find);
    pagination.total = Math.ceil(allProductFind / pagination.limitItems);

    return pagination;
}
module.exports.pagination = async (req , find , model) => {
    const pagination = {
        currentPage : 1, 
        limitItems : 4
      }
      if(req.query.page){
        pagination.currentPage = parseInt(req.query.page);
      }
      pagination.skip = (pagination.currentPage - 1) * pagination.limitItems
      const totalProduct = await model.countDocuments(find);
      const totalPage = Math.ceil(totalProduct / pagination.limitItems);
      pagination.total = totalPage
  
      return pagination
  }
