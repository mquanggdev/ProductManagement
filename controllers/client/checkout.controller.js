const Cart = require("../../model/carts.model");
const Product = require("../../model/product.model");
const Order = require("../../model/orders.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
  
    const cart = await Cart.findOne({
      _id: cartId
    });
  
    cart.totalPrice = 0;
  
    if(cart.products.length > 0) {
      for (const product of cart.products) {
        const productInfo = await Product.findOne({
          _id: product.productId
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (1 - productInfo.discountPercentage/100) * productInfo.price;
        product.productInfo = productInfo;
        product.totalPrice = productInfo.priceNew * product.quantity;
        cart.totalPrice += product.totalPrice;
      }
    }

    res.render("client/pages/checkout/index", {
      pageTitle: "Trang Thanh Toán",
      cartDetail : cart ,
    });
  }

// [Post] /checkout/order
module.exports.orderPost = async (req , res) => {
    console.log(req.body);
    const userInfo = req.body ;
    const orderData = {
        userInfo :userInfo,
        products : []
    }

    const cartId = req.cookies.cartId ;
    const cart = await Cart.findOne({
            _id : cartId
        }
    )
    for (const product of cart.products) {
        const productInfo = await Product.findOne({
            _id : product.productId
        })
        orderData.products.push({
            productId: product.id,
            price :productInfo.price,
            quantity: product.quantity,
            discountPercentage : productInfo.discountPercentage
        })
    }
    const newOrder = new Order(orderData);
    await newOrder.save() ;


    await Cart.updateOne({
        _id :cartId
    } ,{
        products : []
    })
    res.redirect(`/checkout/success/${newOrder.id}`) ;
}