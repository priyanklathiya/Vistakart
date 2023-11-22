
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

const categorySchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
    link: { type: String, default: 'all' },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    imagePath: { type: String, default: 'default' },
    status: { type: Boolean, default: true },
});

const info = mongoose.model("featuredCategory", categorySchema);
module.exports = info;