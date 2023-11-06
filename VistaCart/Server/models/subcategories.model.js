
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// product schema
const subcategories = new Schema({
    subcategoryName: { type: String, required: true, trim: true },
    categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'category'
    },
});


const info = mongoose.model("subcategory", subcategories);  // collection name - subcategory
module.exports = info;