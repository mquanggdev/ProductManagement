const Cart = require("../../model/carts.model");

module.exports.cartId = async (req,res,next) => {
    if(!req.cookies.cartId) {
        const cart = new Cart() ;
        cart.save() ;


        const expries = 365 * 24 * 60 * 60 * 1000 ;

        res.cookie("cartId",cart.id ,{
            expries : new Date(Date.now() + expries)
        });
    }else{
        const cart = await Cart.findOne({
            _id : req.cookies.cartId,
        });
        res.locals.cartTotal = cart.products.length || 0 ;
    }
    next() ;
}
