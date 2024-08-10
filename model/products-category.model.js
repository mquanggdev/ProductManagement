const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productsCategoryModelSchema = new mongoose.Schema({
    title: String,
    parent_id:{
        type:String,
        default:""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug:{
         type: String,
         slug: "title",
         unique : true 
        },
    createBy:{
        account_id: String,
        createAt: {
            type:Date ,
            default:Date.now
        }
    },
    deleteBy:{
        account_id: String,
        deletedAt:Date
    },
    updateBy:
        {
            account_id: String,
            updateAt:Date
        },
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const ProductCategory = mongoose.model("ProductCategory" , productsCategoryModelSchema , "products-category");
module.exports = ProductCategory;