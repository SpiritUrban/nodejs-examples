import mongoose from 'mongoose';

// create a AlarmMsg model
var AlarmMsg = mongoose.model('AlarmMsg', {
    text: Object,
    audio: Object,
    analogs: [],
    enabled: Boolean,
    created: { type: Date, default: Date.now },
});

export default AlarmMsg;