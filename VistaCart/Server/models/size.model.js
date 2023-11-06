
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// size schema
const sizeSchema = new Schema({
    size: { type: String, required: true, trim: true },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
});

const info = mongoose.model("size", sizeSchema);  // collection name - size
module.exports = info;