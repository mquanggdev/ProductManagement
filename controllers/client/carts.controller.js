const Cart = require("../../model/carts.model");
const Product = require("../../model/product.model");

// [GET] /cart
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
  
    res.render("client/pages/carts/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: cart
    });
  }
module.exports.addPost = async (req,res) => {
    try {
        const cartId = req.cookies.cartId ;    
        const productId = req.params.productId ;
        const quantity = parseInt(req.body.quantity);

        const cart = await Cart.findOne({
            _id : cartId
        })

        const existProductInCart = cart.products.find(item => {
            return item.productId == productId
        })

        if(existProductInCart) {
            await Cart.updateOne({
                _id : cartId ,
                'products.productId' :productId
            } , {
                $set : {
                    'products.$.quantity':quantity + existProductInCart.quantity
                }
            })
        }else {
            await Cart.updateOne({
                _id : cartId,
            },{
                $push : {
                    products:{
                        productId:productId,
                        quantity : quantity
                    }
                }
            })
        }
        req.flash("success" , "Thêm sản phẩm thành công!")
        res.redirect("back") ;
    } catch (error) {
        console.log(error);
        res.redirect("/") ;
    }
}