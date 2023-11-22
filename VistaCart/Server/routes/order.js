const express = require( "express");
const router = express.Router();

const { addCart, addShippingDetails, addOrderAndPaymentDetails, getCart, removeFromCart, getShippingDetails, createOrder, getOrderHistoryByUser, getOrderHistoryByStatus } = require("../controllers/Order");

// router.route("/").get(getAllProducts);

router.route("/getCart").post(getCart);
router.route("/addCart").post(addCart);
router.route("/removeFromCart").post(removeFromCart);

router.route("/addShippingDetails").post(addShippingDetails);
router.route("/getShippingDetails").post(getShippingDetails);
router.route("/addOrderAndPaymentDetails").post(addOrderAndPaymentDetails);
router.route("/createOrder").post(createOrder);
router.route("/getOrderHistoryByUser").post(getOrderHistoryByUser);
router.route("/getOrderHistoryByStatus").post(getOrderHistoryByStatus);


module.exports = router;