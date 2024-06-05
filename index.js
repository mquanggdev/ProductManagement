const express = require('express');
const app = express();
require('dotenv').config();
const routeClient = require("./routes/client/index.route");
const port = process.env.PORT;
const database = require("./config/database");


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static("public"));

routeClient(app);
database.connect();

app.listen(port , () => {
    console.log(`Đang chạy cổng 3000`);
})