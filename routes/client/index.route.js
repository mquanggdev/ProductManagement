const homeRouter = require("./home.route");
const productsRouter = require("./products.route");
const categoryProductMiddelware = require("../../middleware/client/categoryProduct.middleware");

module.exports = (app) => {
    app.use(categoryProductMiddelware.category);
    app.use("/" , homeRouter);
    app.use("/products" , productsRouter);
} 