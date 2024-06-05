const express = require('express');
const app = express();
require('dotenv').config();
console.log(process.env.PORT);
const routeClient = require("./routes/client/index.route");
const port = process.env.PORT;



app.set('views', './views');
app.set('view engine', 'pug');


routeClient(app);

app.listen(port , () => {
    console.log(`Đang chạy cổng 3000`);
})