const mongoose = require("mongoose");
const generateHelper = require("../helper/generate.help");
const accountModelSchema = new mongoose.Schema({
    fullname: String,
    description: String,
    email:String,
    password:String,
    token:{
        type:String,
        default: generateHelper.generateRandomString(30)
    },
    phone:String,
    avatar:String,
    role_id:String,
    status:String,
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Account = mongoose.model("Account" , accountModelSchema , "accounts");
module.exports = Account;