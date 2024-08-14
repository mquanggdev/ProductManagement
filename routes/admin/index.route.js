const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route");
const rolesRouter = require("./roles.route");
const accountsRouter = require("./accounts.route");
const authensRouter = require("./authens.route");
const profileRouter = require("./profiles.route");
const systemConfig = require("../../config/system");
const authMiddleware = require("../../middleware/admin/authens.middleware");
const settingRoute = require("./setting.route");
const trashsRoute = require("./trash.route");
const orderRoute = require("./orders.route");

module.exports = (app) =>{
    const PORT = systemConfig.prefixAdmin;
    app.use(`/${PORT}` + "/dashboard", authMiddleware.requireAuth, dashboardRouter);
    app.use(`/${PORT}` + "/products" ,authMiddleware.requireAuth, productsRouter)
    app.use(`/${PORT}` + "/products-category" ,authMiddleware.requireAuth, productsCategoryRouter)
    app.use(`/${PORT}` + "/roles" ,authMiddleware.requireAuth, rolesRouter)
    app.use(`/${PORT}` + "/accounts" ,authMiddleware.requireAuth,accountsRouter)
    app.use(`/${PORT}` + "/authens" , authensRouter)
    app.use(`/${PORT}` + "/profiles" ,authMiddleware.requireAuth, profileRouter)
    app.use(`/${PORT}` + "/settings",authMiddleware.requireAuth,settingRoute);
    app.use(`/${PORT}` + "/trash",authMiddleware.requireAuth,trashsRoute);
    app.use(`/${PORT}` + "/orders",authMiddleware.requireAuth,orderRoute);
} 