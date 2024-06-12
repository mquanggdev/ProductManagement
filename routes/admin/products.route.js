const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller")
router.get("/" , controller.index);
router.get("/change-status/:statusChange/:id",controller.changeStatus) // :id tức là đặt đường dẫn động có tên là id
module.exports = router;