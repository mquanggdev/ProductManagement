const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller")
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
const multer  = require('multer');
const upload = multer();
const accountsValidate = require("../../validate/admin/accounts.validate");

router.get("/" , controller.index);
router.get("/create" , controller.create);
router.post("/create" ,upload.single("avatar"),uploadCloud.uploadSingle,accountsValidate.createPost,controller.createPost);
router.get("/edit/:id" ,controller.edit);
router.patch("/edit/:id" ,upload.single("avatar"),uploadCloud.uploadSingle,accountsValidate.createPost,controller.editPatch);
// router.get("/detail/:id",controller.detail);
// router.get("/delete/:id",controller.delete)
module.exports = router


