const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    cardholderName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        required: true
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
