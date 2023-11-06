
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// category schema
const categorySchema = new Schema({
    categoryName: { type: String, required: true, default: 'default', trim: true },
    subCategory: {  type: String, required: true, default: 'no', trim: true  },
    subCategoryName: { type: String, default: 'default' },
    categoryId: { type: String, default: 'default' },
    imagePath: { type: String, default: 'default' },

});


const info = mongoose.model("category", categorySchema);  // collection name - category
module.exports = info;