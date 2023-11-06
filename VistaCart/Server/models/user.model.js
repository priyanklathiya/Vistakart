
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// user schema
const userSchema = new Schema({
    firstName: { type: String, required: true, default: 'default' },
    lastName: { type: String, required: true, default: 'default' },
    email: { type: String, unique: true, trim: true },
    mobilenumber: { type: String },
    password: { type: String },
    userType: {type: String, enum: ["customer", "admin", "seller"]}
});

userSchema.pre('save',function(next){    // mongoose preprocess
    const user = this
    bcrypt.hash(user.password,10,(error,hash)=>{
        user.password = hash;
        next();
    })
})

const info = mongoose.model("user", userSchema);
module.exports = info;