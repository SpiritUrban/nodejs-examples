import mongoose from 'mongoose';

let Session = mongoose.model('session', {
    userName: String,
    created: { type: Date, default: Date.now },
    userId: String,
    appVersion: String,
    fingerPrint: String,
    random: String,
    ip: String
});

export default Session;