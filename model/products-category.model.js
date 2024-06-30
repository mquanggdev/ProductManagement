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
        }
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const ProductCategory = mongoose.model("ProductCategory" , productsCategoryModelSchema , "products-category");
module.exports = ProductCategory;