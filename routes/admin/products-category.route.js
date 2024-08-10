const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller")
const multer  = require('multer')
const upload = multer();
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloud.middleware");
const validate = require("../../validate/admin/products.validate");


router.get("/" , controller.index);
router.get("/create" , controller.create);
router.post(
    "/create" ,
     upload.single('thumbnail'),
     uploadCloudMiddleware.uploadSingle,
     validate.createPost,
     controller.createPost);
router.get("/edit/:id",controller.edit)
router.patch(
    "/edit/:id" ,
     upload.single('thumbnail'),
     uploadCloudMiddleware.uploadSingle,
     validate.createPost,
     controller.editPatch);
router.get("/detail/:id" , controller.detail);
router.get("/delete/:id",controller.delete);
router.get("/changeStatus/:status/:id" , controller.changeStatus);
router.patch("/changePosition/:id" , controller.changePosition);
router.patch("/change-multi" , controller.changeMulti)

module.exports = router