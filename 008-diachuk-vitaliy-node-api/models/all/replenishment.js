import mongoose from 'mongoose';

const { Schema } = mongoose;

// const blockInner = new Schema({
//     file: String,
//     fileId: String,
//     type: String,
//     text: String,
// });

// const block = new Schema({
//     file: String,
//     fileId: String,
//     fileIdList: [blockInner],
//     type: String,
//     text: String,
// });

var Replenishment = mongoose.model('Replenishment', {
    created: { type: Date, default: Date.now },

    amount: Number,
    phase1: [],
    phase2: [],
    phase3: [],


    // type: {},
    // categories: {},
    // brands: {},
    // models: {},
    // // brand: String, // ???
    // img: String,
    // title: String,
    // tags: [],
    // options: [],
    // paymentMode: String,
    // isDiscount: Boolean,
    // description: String,
    // payment: [
    //     {
    //         currency: String,
    //         price: Number,
    //         priceDiscount: Number,
    //         discount: Number,
    //     }
    // ],
    // blocks: [block],
    // isBasic: Boolean,
    // amount: Number,
});

export default Replenishment;