const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/carts.controller");
router.get("/" , controller.index);
router.post("/add/:productId" , controller.addPost);

module.exports = router ;