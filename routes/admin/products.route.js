const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller")
const storageMulterHelper = require("../../helper/storageMulter.helper")
const multer  = require('multer')
const upload = multer({ storage: storageMulterHelper })





router.get("/" , controller.index);
router.patch("/change-status/:statusChange/:id",controller.changeStatus) // :id tức là đặt đường dẫn động có tên là id
router.patch("/change-multi",controller.changeMulti)
router.patch("/delete/:id" , controller.deleteItem);
router.patch("/change-position/:id" , controller.changePosition);
router.get("/create" , controller.create);
router.post("/create" ,upload.single('thumbnail'), controller.createPost);
module.exports = router