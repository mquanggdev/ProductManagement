const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller")
const validate = require("../../validate/admin/products.validate");

router.get("/" , controller.index);
router.get("/create" , controller.create);
router.post("/create" ,validate.createPost,controller.createPost);
router.get("/edit/:id" ,controller.edit);
router.patch("/edit/:id" ,validate.createPost,controller.editPatch);
module.exports = router


