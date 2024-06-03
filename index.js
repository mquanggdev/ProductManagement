const express = require('express');
const app = express();
const port = 3000 ;


app.set('views', './views');
app.set('view engine', 'pug');

app.get("/" , (req, res) => {
    res.render("client/pages/home/index.pug" , {
        pageTitle : "Trang Chủ"
    });
})
app.get("/products" , (req, res) => {
    res.render("client/pages/products/index.pug" , {
        pageTitle :"Trang Sản Phẩm"
    });
})
app.listen(port , () => {
    console.log(`Đang chạy cổng 3000`);
})