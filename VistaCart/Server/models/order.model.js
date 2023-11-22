const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    shippingId: {
        type: Schema.Types.ObjectId,
        ref: 'shipping',
        required: true
    },
    orderDetails: [{
        productName: {
            type: String,
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String
        }
    }],
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryStatus: {
        type: String,
        trim: true,
        required: true,
        enum: ['pending', 'processing', 'completed'],
        default: 'pending'
    },
    statusCode: {
        type: String,
        trim: true,
        required: true,
        enum: ['0', '1', '2'],
        default:'0' // 0 - order approval pending, 1 - order approved, 2 - order not approved
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
