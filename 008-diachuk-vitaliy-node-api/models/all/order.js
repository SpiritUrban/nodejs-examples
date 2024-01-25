import mongoose from 'mongoose';
// import Product from './product.js';

var Order = mongoose.model('Order', {
    created: { type: Date, default: Date.now },
    number: { type: Number, default: 0 },
    statusNumber: Number,
    statusName: String,
    // productsList: [Product],
    name: String,
    phone: String,
    email: String,
    productsList: [],
    deliveryType: String,
    department: String,
    paymentType: String,
    street: String,
    house: String,
    flat: String,
    total: Number,
    //
    source: String,
    deposit: String,
    cashOnDeliveryAmount: String,
    city: String,
    np: String,
    ttn: String,
    comment: String,
    confirm: {}
});

export default Order;