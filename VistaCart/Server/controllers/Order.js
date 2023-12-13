const cartmodel = require('../models/cart.model');
const shippingmodel = require('../models/shipping.model');
const ordermodel = require('../models/order.model');
const paymentmodel = require('../models/payment.model');
const productmodel = require('../models/product.model');

// const addCart = async (req, res) => {
//     try {
//         await cartmodel.create({
//             userId: req.body.userId,
//             cartDetails: req.body.cartDetails
//         }).then(() => {
//             res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
//         });
//     } catch (error) {
//         res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
//     }
// };

const addCart = async (req, res) => {
    const { userId, cartDetails } = req.body;

    try {
        // Check if a cart entry with the same userId already exists
        const existingCart = await cartmodel.findOne({ userId });

        if (existingCart) {
            // If cart entry exists, check for productId and size in cartDetails
            const existingProductwithsize = await cartmodel.findOne({ "cartDetails.productId": cartDetails[0].productId, "cartDetails.size": cartDetails[0].size });
            
            // console.log(existingProductwithsize);

            if (existingProductwithsize) {
                // If product with the same productId and size exists, update the quantity

                const updatedCart = await cartmodel.findOneAndUpdate(
                    {
                        userId,
                        "cartDetails.productId": cartDetails[0].productId,
                        "cartDetails.size": cartDetails[0].size
                    },
                    {
                        $inc: { "cartDetails.$.quantity": cartDetails[0].quantity }
                    },
                    { new: true }
                );

                res.status(200).json({ msg: "Quantity updated successfully.", status: 1, updatedCart });
                
            } else {
                // If product with the same productId and size doesn't exist, add the data
                const updatedCart = await cartmodel.findOneAndUpdate(
                    { userId },
                    {
                        $addToSet: {
                            cartDetails: cartDetails[0]
                        }
                    },
                    { new: true }
                );

                res.status(200).json({ msg: "Data added successfully.", status: 1, updatedCart });

            }
            
        } else {
            // If cart entry does not exist, create a new cart entry
            await cartmodel.create({ userId, cartDetails });
            res.status(200).json({ msg: "Data inserted successfully.", status: 1 });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }
};
    

const addShippingDetails = async (req, res) => { 
    try {
        const newShipping = await shippingmodel.create({
            userId: req.body.userId,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            phone: req.body.phone
        });

        res.status(200).json({ msg: "Data inserted successfully.", status: 1, shippingData: newShipping });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }    
};

// const addOrderAndPaymentDetails = async (req, res) => {
//     const { userId, username, shippingDetails, orderDetails, totalAmount, deliveryStatus } = req.body;

//     try {
//         // Step 1: Create Order
//         const order = await Order.create({
//             userId,
//             username,
//             shippingId: shippingDetails._id, // Assuming that the shippingDetails have already been created
//             orderDetails,
//             totalAmount,
//             deliveryStatus
//         });

//         // Step 2: Create Payment
//         await Payment.create({
//             userId,
//             cardholderName: req.body.cardholderName,
//             cardNumber: req.body.cardNumber,
//             expirationDate: req.body.expirationDate,
//             cvv: req.body.cvv,
//             orderId: order._id,
//             paymentDate: Date.now()
//         });

//         res.status(200).json({ msg: "Order and payment details added successfully.", status: 1 });
//     } catch (error) {
//         res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
//     }
// };

const addOrderAndPaymentDetails = async (req, res) => {
    // console.log(req.body);
    const { userId, username, shippingId, orderDetails, totalAmount, deliveryStatus } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Step 1: Create Order
        const order = await ordermodel.create(
            [
                {
                    userId,
                    username,
                    shippingId,
                    orderDetails,
                    totalAmount,
                    deliveryStatus
                }
            ],
            { session }
        );

        // Step 2: Create Payment
        await paymentmodel.create(
            [
                {
                    userId,
                    cardholderName: req.body.cardholderName,
                    cardNumber: req.body.cardNumber,
                    expirationDate: req.body.expirationDate,
                    cvv: req.body.cvv,
                    orderId: order._id,
                    paymentDate: Date.now()
                }
            ],
            { session }
        );

        
        // Step 3: Delete Cart Items
        await cartmodel.deleteMany({ userId });


        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Order and payment details added successfully.", status: 1 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ msg: "Error: Data could not be added", err: error, status: 0 });
    }
};


// const getShippingDetails = async (req, res) => {
//     const userId = req.body.userId;
//     const cartDetails = await cartmodel.find({ userId: userId });
//     console.log(cartDetails);
//     if (cartDetails) {
        
//     }
//     res.status(200).json({ cartDetails });
// };

const getCart = async (req, res) => {
    const userId = req.body.userId;

    try {
        // Fetch cart details
        const cartDetails = await cartmodel.find({ userId: userId });

        if (cartDetails) {
            // Array to store final result
            const resultArray = [];

            // Iterate over cart details
            for (const cartItem of cartDetails[0].cartDetails) {
                // Fetch product details using productId
                const productDetails = await productmodel.findOne({ _id: cartItem.productId });

                if (productDetails) {
                    // Construct new object with required details
                    const newItem = {
                        sku: productDetails.sku,
                        productName: productDetails.productName,
                        productId: productDetails._id,
                        price: productDetails.price,
                        quantity: cartItem.quantity,
                        size: cartItem.size,
                        imagePath: {
                            imagePath1: productDetails.imagePath.imagePath1,
                            imagePath2: productDetails.imagePath.imagePath2,
                            imagePath3: productDetails.imagePath.imagePath3,
                        },
                        totalPrice: productDetails.price * cartItem.quantity,
                    };

                    // Push the new item to the result array
                    resultArray.push(newItem);
                }
            }

            // Send the result array to the user
            res.status(200).json({ cartDetails: resultArray });
        } else {
            res.status(200).json({ cartDetails: [] }); // or handle as needed
        }
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// const removeFromCart = async (req, res) => {
//     const { userId, productId } = req.body;
//     console.log(userId, productId);

//   try {

//     const cartDetails = await cartmodel.findOne({ userId: userId });
//     console.log(cartDetails);
//     if (cartDetails) {
//       // Remove the item from the cart based on productId
//       const updatedCart = cartDetails.cartDetails.filter(item => item.productId !== productId);
//       console.log(updatedCart);

//       // Update the cart in the database
//       await cartmodel.updateOne({ userId: userId }, { cartDetails: updatedCart });

//       res.status(200).json({ message: 'Item removed from the cart successfully', status: 1 });
//     } else {
//       res.status(404).json({ message: 'Cart not found', status: 3 });
//     }
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     res.status(500).json({ error: 'Internal Server Error', errmsg: error, status: 0 });
//   }
// };



const removeFromCart = async (req, res) => { 
    try {
        const { userId, productId, size } = req.body;
        // console.log(userId, productId, size);
        
        const cartDetails = await cartmodel.findOne({ userId: userId });
        if (cartDetails) {
            await cartmodel.updateOne({
                userId,
                "cartDetails.productId": productId,
                "cartDetails.size": size
            }, {
                $pull: {
                    cartDetails: { productId: productId, size: size }
                }
            }).then(() => {
                res.status(200).json({ message: 'Item removed from the cart successfully', status: 1 });
            });
        } else {
            res.status(404).json({ msg: "No Data found to update", status: 3 });
        }

        
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }    
};

const getShippingDetails = async (req, res) => {
    const userId = req.body.userId;

    try {
        const shippingDetails = await shippingmodel.find({ userId: userId });
        // console.log(shippingDetails);
        if (shippingDetails) {
            res.status(200).json({ shippingDetails });  
        } else {
            res.status(404).json({ msg:"No data found" });
        }
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ error: error });
    }
};

const createOrder = async (req, res) => { 

    try {
        
        const userId = req.body.userId;
        const shippingId = req.body.shippingId;
        const cartData = req.body.cartData;
        const totalAmount = req.body.totalAmount;

        // Create an array to store order details
        const orderDetails = [];

        // Iterate through cartData to populate orderDetails
        cartData.forEach((cartItem) => {
            orderDetails.push({
                productName: cartItem.productName,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                price: cartItem.price,
                size: cartItem.size,
            });
        });

        // Create the order document
        const order = await ordermodel.create({
            userId: userId,
            shippingId: shippingId,
            orderDetails: orderDetails,
            totalAmount: totalAmount,
            deliveryStatus: 'pending', // Set the default delivery status
            statusCode: '0', // Set the default status code
        });

        // Delete records from the cart after successful order creation
        await cartmodel.deleteOne({ userId: userId });
        
        // Send the order response to the client
        res.status(200).json({
            msg: 'Order created successfully. Cart items deleted.',
            status: 1,
            order: order,
        });

    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ msg: 'Error creating order.', err: error, status: 0 });
    }

}


const getOrderHistoryByUser = async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    try {
        // Fetch order history
        const OrderHistory = await ordermodel.find({ userId: userId });
        res.status(200).json({ OrderHistory });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getOrderHistoryByStatus = async (req, res) => {
    const statusCode = req.body.statusCode;
    try {
        // Fetch order history
        const OrderHistory = await ordermodel.find({ statusCode: statusCode });
        res.status(200).json({ OrderHistory });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getOrderById = async (req, res) => {
    const orderId = req.body.orderId;
    try {
        // Fetch OrderDetails
        const OrderDetails = await ordermodel.find({ _id : orderId });
        res.status(200).json({ OrderDetails });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateOrderStatus = async (req, res) => { 
    try {
        console.log(req.body);
         await ordermodel.findOneAndUpdate({ _id: req.body.orderId }, {
            statusCode: req.body.statusCode
        }).then(() => {
            res.status(200).json({ msg: "Data updated successfully.", status: 1 });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error: Data could not be updated", err: error, status: 0 });
    }
};

const getInvoiceDetails = async (req, res) => {
    const orderNumber = req.body.orderNumber;
    console.log(orderNumber);
    try {
        // Fetch order history
        const InvoiceDetails = await ordermodel.find({ _id: orderNumber });
        const shippingDetails = await shippingmodel.find({ _id: InvoiceDetails[0].shippingId });
        res.status(200).json({ InvoiceDetails, shippingDetails });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addCart, 
    addShippingDetails, 
    addOrderAndPaymentDetails, 
    getCart, 
    removeFromCart, 
    getShippingDetails, 
    createOrder, 
    getOrderHistoryByUser,
    getOrderHistoryByStatus,
    getOrderById,
    updateOrderStatus,
    getInvoiceDetails
}