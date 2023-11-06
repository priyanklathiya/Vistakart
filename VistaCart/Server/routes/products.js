const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})


const { getAllProducts, addProduct, deleteProduct, updateProduct } = require("../controllers/products");

router.route("/getAllProducts").get(getAllProducts);

// router.route("/addProduct").post(upload.fields([ { name: 'imagePath1', maxCount: 1 }, { name: 'imagePath2', maxCount: 1 }, { name: 'imagePath3', maxCount: 1 }, ]), addProduct);

router.route("/addProduct").post(upload.fields([ { name: 'imagePath1', maxCount: 1 }, { name: 'imagePath2', maxCount: 1 },  { name: 'imagePath3', maxCount: 1 },
]), addProduct);



router.route("/deleteProduct").post(deleteProduct);

router.route("/updateProduct").post(upload.fields([ { name: 'imagePath1', maxCount: 1 }, { name: 'imagePath2', maxCount: 1 },  { name: 'imagePath3', maxCount: 1 },
]), updateProduct);

// router.route("/updateProduct").post(updateProduct);

module.exports = router;