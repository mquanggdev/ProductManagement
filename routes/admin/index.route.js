const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
module.exports = (app) =>{
    app.use("/admin/dashboard" , dashboardRouter);
    app.use("/admin/products" , productsRouter)
} 