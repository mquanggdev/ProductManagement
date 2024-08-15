const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/orders.controller");
router.get("/" , controller.index);
router.patch("/changeTransit/:status/:id" , controller.changeTransit);
router.get("/detail/:id" , controller.detail)
module.exports = router ;