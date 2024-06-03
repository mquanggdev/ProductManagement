const express = require("express");
const router = express.Router();

router.get("/" , (req, res) => {
    res.render("client/pages/home/index.pug" , {
        pageTitle : "Trang Chủ"
    });
})

module.exports = router ;