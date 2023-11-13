const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// featured products schema
const productSchema = new Schema({
        productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    status: { type: Boolean, default: true },
});

const info = mongoose.model("featuredProduct", productSchema); 
module.exports = info;