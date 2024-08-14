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
            productId: product.productId,
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

//GET /checkout/success/:orderId

module.exports.orderSuccess = async (req, res) => {
    const orderId = req.params.orderId;

  const order = await Order.findOne({
    _id: orderId
  });

  let totalPrice = 0;

  for (const item of order.products) {
    const productInfo = await Product.findOne({
      _id: item.productId
    });

    item.thumbnail = productInfo.thumbnail;
    item.title = productInfo.title;
    item.priceNew = (1 - item.discountPercentage/100) * item.price;
    item.totalPrice = item.priceNew * item.quantity;
    totalPrice += item.totalPrice;
  }

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    totalPrice: totalPrice
  });
  }