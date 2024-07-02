const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route");
const rolesRouter = require("./roles.route");
const accountsRouter = require("./accounts.route");
const authensRouter = require("./authens.route");
const systemConfig = require("../../config/system");

module.exports = (app) =>{
    const PORT = systemConfig.prefixAdmin;
    app.use(`/${PORT}` + "/dashboard" , dashboardRouter);
    app.use(`/${PORT}` + "/products" , productsRouter)
    app.use(`/${PORT}` + "/products-category" , productsCategoryRouter)
    app.use(`/${PORT}` + "/roles" , rolesRouter)
    app.use(`/${PORT}` + "/accounts" , accountsRouter)
    app.use(`/${PORT}` + "/authens" , authensRouter)
} 