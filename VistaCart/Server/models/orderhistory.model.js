const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const orderHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orders: [
        {
            orderId: {
                type: Schema.Types.ObjectId,
                ref: 'order',
                required: true
            },
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
                required: true
            }
        }
    ]
});

const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

module.exports = OrderHistory;
