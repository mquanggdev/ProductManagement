const mongoose = require("mongoose");
const rolesModelSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions:{
        type:Array,
        default:[]
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt:Date
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Role = mongoose.model("Role" , productModelSchema , "Roles");
module.exports = Product;