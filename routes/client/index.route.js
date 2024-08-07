const homeRouter = require("./home.route");
const productsRouter = require("./products.route");
const searchRouter = require("./search.route");
const cartsRouter = require("./carts.route");
const categoryProductMiddelware = require("../../middleware/client/categoryProduct.middleware");
const cartMiddleware = require("../../middleware/client/carts.middleware");
const checkoutRouter = require("./checkout..route");
const userRouter = require("./users.route");
const chatRouter = require("./chat.route");
const userMiddleware = require("../../middleware/client/users.middleware");
const settingMiddleware = require("../../middleware/client/setting.middleware");


module.exports = (app) => {
    app.use(categoryProductMiddelware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.setting);
    
    app.use("/" , homeRouter);
    app.use("/products" , productsRouter);
    app.use("/search" , searchRouter);
    app.use("/carts" , cartsRouter);
    app.use("/checkout" , checkoutRouter);
    app.use("/users", userRouter)
    app.use("/chat",userMiddleware.requireAuth, chatRouter)

} 