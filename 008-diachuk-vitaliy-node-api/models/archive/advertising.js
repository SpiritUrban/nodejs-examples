import mongoose from 'mongoose';

// create a Advertising model
var Advertising = mongoose.model('Advertising', {
    text: Object,
    audio: Object,
    analogs: [],
    enabled: Boolean,
    created: { type: Date, default: Date.now },
});

export default Advertising;