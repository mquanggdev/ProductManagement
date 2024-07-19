const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productModelSchema = new mongoose.Schema({
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
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
    updateBy:[
        {
            account_id: String,
            updateAt:Date
        }
    ],
    featured:{
        type:String,
        default:"0"
    }
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Product = mongoose.model("Product" , productModelSchema , "products");
module.exports = Product;