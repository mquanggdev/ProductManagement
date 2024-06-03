const express = require("express");
const router = express.Router();

router.get("/" , (req, res) => {
    res.render("client/pages/products/index.pug" , {
        pageTitle :"Trang Sản Phẩm"
    });
})

module.exports = router ;