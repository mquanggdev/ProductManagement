const express = require('express');
var bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route")
const port = process.env.PORT;
const database = require("./config/database");
const systemConfig = require("./config/system");
var flash = require('express-flash');
var session = require('express-session')
var cookieParser = require('cookie-parser')

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static("public"));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// parse application/json
app.use(bodyParser.json())
//flash
app.use(cookieParser('Yalidas'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end flash

routeClient(app);
routeAdmin(app);
database.connect();

app.listen(port , () => {
    console.log(`Đang chạy cổng 3000`);
})