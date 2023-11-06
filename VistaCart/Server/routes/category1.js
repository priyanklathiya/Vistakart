const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})


const { addCategory } = require("../controllers/category1");

// router.route("/").get(getAllProducts);

// uncomment the following route to know how to upload photos
router.route("/addCategory").post(upload.single('imagePath'), addCategory);


module.exports = router;