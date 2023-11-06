
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// product schema
const productSchema = new Schema({
    sku: { type: String, required: true, unique: true, trim: true },
    productName: { type: String, required: true, default: 'default' },
    productDescription: { type: String },
    quantity: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'unisex'] },
    price: { type: Number },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    imagePath: {
        imagePath1: { type: String },
        imagePath2: { type: String, default: 'default' },
        imagePath3: { type: String, default: 'default' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
});


const info = mongoose.model("product", productSchema);  // collection name - product
module.exports = info;