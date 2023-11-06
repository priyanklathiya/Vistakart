const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');


// database connection
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri,
     { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });


const app = new express();
app.use(express.static(path.resolve(__dirname + '/public')))

const port = process.env.PORT || 8080;

app.use(cors({
    origin: ["http://localhost:3000","http://192.168.56.1:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(bodyParser.urlencoded())
app.use(express.json());
app.use(cookieParser());


// global session variable

app.use(expressSession({
    secret: 'session key abc', // secret key used to encrypt the session cookie
    // cookie: {
    //     secure: false,
    //     maxAge: 1000 * 60 * 60 * 24
    // }
}));

global.userId = null;
global.userType = null;

app.use("*",(req,res,next)=>{
    userId = req.session.userId;
    userType = req.session.userType;
    next();
})



// image path
app.use('/Images', express.static('Images'));

// Middlewares
const authentication = require('./middlewares/authMiddleware');

app.get('/auth/userSession', authentication.sessionUser);
app.get('/auth/logout', authentication.logout);

//  routers of the application
const productRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const categoryRoutes = require('./routes/category');
const subCategoryRoutes = require('./routes/subCategory');
const brands = require('./routes/brands');
const size = require('./routes/size');
const quantity = require('./routes/quantity');

// admin panel
app.use('/api/products', productRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subCategoryRoutes);
app.use('/api/brands', brands);
app.use('/api/size', size);
app.use('/api/quantity', quantity);

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`);
})