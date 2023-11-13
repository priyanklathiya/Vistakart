const express = require( "express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/featured_categories_home');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()  + '_' +  file.originalname);
    }
})

const upload = multer({
    storage: storage,
})


const { addFCategory, addFProduct, getAllFCategory, getAllFProduct, deleteFProduct, deleteFCategory, updateFCategoryStatus, updateFProductStatus, updateFeaturedCategory } = require("../controllers/home");

// router.route("/").get(getAllProducts);

// router.route("/addFeaturedCategory").post(addFCategory);
router.route("/addFeaturedCategory").post(upload.fields([ { name: 'imagePath', maxCount: 1 } ]), addFCategory);

router.route("/updateFeaturedCategory").post(upload.fields([ { name: 'imagePath', maxCount: 1 } ]), updateFeaturedCategory);

router.route("/getAllFeaturedCategory").get(getAllFCategory);
router.route("/deleteFeaturedCategory").post(deleteFCategory);
router.route("/updateCategoryStatus").post(updateFCategoryStatus);


router.route("/addFeaturedProduct").post(addFProduct);
router.route("/getAllFeaturedProduct").get(getAllFProduct);
router.route("/deleteFeaturedProduct").post(deleteFProduct);
router.route("/updateProductStatus").post(updateFProductStatus);

module.exports = router;