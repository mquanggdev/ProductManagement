const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/trash.controller");
router.get("/" , controller.index);
router.get("/products" , controller.products);
router.get("/products-category" , controller.productsCategory);
router.get("/roles" , controller.roles);
router.get("/accounts" , controller.accounts);
router.get("/users" , controller.users);
router.patch("/:record/restore" , controller.restore);
router.patch("/:record/deletePermanent" , controller.deletePermanent);

module.exports = router ;