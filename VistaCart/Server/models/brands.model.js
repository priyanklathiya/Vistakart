
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// brand schema
const brandSchema = new Schema({
    brandName: { type: String, required: true, trim: true },
});

const info = mongoose.model("brand", brandSchema);  // collection name - brand
module.exports = info;