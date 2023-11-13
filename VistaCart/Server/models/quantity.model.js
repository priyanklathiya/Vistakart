const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// quantity schema
const quantity = new Schema({
    quantity: { type: Number, required: true, trim: true },
    sizeId: {
        type: Schema.Types.ObjectId,
        ref: 'size'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    sku: { type: String, required: true, trim: true },
});

const info = mongoose.model("quantity", quantity);  // collection name - quantity
module.exports = info;