import mongoose from 'mongoose';

// create a Hotel model
var Hotel = mongoose.model('Hotel', {
    hotel: String,
    administrator: String,
    email: String,
    ip: String,
    created: { type: Date, default: Date.now },
    secondData: Object,
    lastUpdate: { type: Date, default: Date.now }, // DEPRECATED!!! Should be: "last Response"
    previoustUpdate: { type: Date, default: Date.now }, // DEPRECATED!!! Should be: "previous Response"
    map: {
        coordinates: {
            x: Number,
            y: Number,
        }
    },
    open_password: String,
    password: { type: String },
    appliedOnSatellite: Boolean,
});

export default Hotel;