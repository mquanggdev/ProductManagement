const Product = require("../../model/product.model");
const ProductCategory = require("../../model/products-category.model");
const Account = require("../../model/accounts.model");
const User = require("../../model/users.model");
const Order = require("../../model/orders.model");
const paginationHelper = require("../../helper/pagination.helper");
const systemConfig = require("../../config/system");

module.exports.index = async (req , res) => {
    const orders = await Order.find({});
    var orderInfo = [] ;
    
    
    for (const item of orders) {
        const order = {} ;
        order.userInfo = item.userInfo ;
        let quantity = 0 ;
        let totalPrice = 0 ;
        for(const product of item.products){
            quantity += product.quantity;
            totalPrice += (product.quantity * product.price) * (1 - product.discountPercentage/100) ;
        }
        order.quantity = quantity;
        order.totalPrice = totalPrice;
        order.status = item.status ;
        order.paid = item.paid

        orderInfo.push(order);
    }


    const pagination = await paginationHelper.pagination(req ,{},Order);

    res.render(`admin/pages/orders/index.pug` , {
        pageTitle : "Danh sách đơn hàng đã đặt" , 
        orders : orderInfo,
        pagination: pagination
    });
}