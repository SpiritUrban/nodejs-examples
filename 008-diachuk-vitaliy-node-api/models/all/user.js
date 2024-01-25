import mongoose from 'mongoose';

const User = mongoose.model('User', {
    room: String,
    language: String,
    isLogged: { type: Boolean, default: true }, // when you get user, its mean that you are logged
    shouldLogout: Date,
    oauthID: Number,
    created: Date,
    name: String,
    fullName: String,
    firstName: String,
    lastName: String,
    nickname: String,
    purchasesMade: [],
    savedNumbers: [],
    username: { type: String, index: true, required: true, unique: true },
    openPassword: String,
    password: { type: String },
    email: { type: String, unique: true },
    emailToken: String,
    emailVerified: Boolean,
    phoneVerified: Boolean,
    status: String,
    role: String,
    iss: String,
    dateOfBirth: Date,
    active: Boolean,
    lastLogin: { type: Date, default: Date.now },
    lastIp: String,
    avatar: String,
    sendNotifications: Boolean,
    address: String,
    addresses: [],
    city: String,
    postcode: String,
    country: String,
    phone: String,
    phones: [],
    authToken: String,
    assToken: String,
    // wallets
    wallets: {
        USD: {
            balance: Number
        }
    },
    // auth by
    facebook: {
        id: String,
        token: String,
        email: String,
        username: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        username: String
    },
    linkedUsers: [],
    linkPin: Number,
    phonePin: Number,
    lastAppeal: { type: Date, default: Date.now },
    lastMethod: String,
    gender: String,
    skills: String,
    specialization: String
    // wallets: [walletSchema],
    // cars: [carSchema],
    //numericId: { type: Number, index: { unique: true } },
});

// //Schema
// let walletSchema = new Schema({
//     wallet_name: { type: String, index: true },
//     wallet_id: { type: String, index: { unique: true } },
//     currency: { type: String, required: true },
//     balance: Number,
//     active: Boolean
// }, { minimize: false, timestamps: true });

// let carSchema = new Schema({
//     reg_plate: { type: String, index: true },
//     primary: Boolean,
//     show_to_public: Boolean,
//     make: String,
//     model: String,
// }, { minimize: false, timestamps: true });

export default User;