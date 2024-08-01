const Cart = require("../../model/carts.model");

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