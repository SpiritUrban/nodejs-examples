import mongoose from 'mongoose';

const { Schema } = mongoose;

const blockInner = new Schema({
    file: String,
    fileId: String,
    type: String,
    text: String,
});

const block = new Schema({
    file: String,
    fileId: String,
    fileIdList: [blockInner],
    type: String,
    text: String,
});

var Product = mongoose.model('Product', {
    created: { type: Date, default: Date.now },
    type: {},
    categories: {},
    brands: {},
    models: {},
    modelsMultiple: [],
    // brand: String, // ???
    img: String,
    title: String,
    tags: [],
    options: [],
    paymentMode: String,
    isDiscount: Boolean,
    description: String,
    payment: [
        {
            currency: String,
            price: { type: Number, default: 0 },
            priceDiscount: { type: Number, default: 0 },
            discount: { type: Number, default: 0 },
        }
    ],
    blocks: [block],
    isBasic: Boolean,
    isMultiModel: Boolean,
    amount: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    isPublish: Boolean,
    article: String,
    articleOfBasicProduct: String,
    articlesOfRelatedProductsByColor: [],
    relatedColors: [],
    //
    basicProduct: {},
});

export default Product;