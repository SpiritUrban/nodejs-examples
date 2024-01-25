import mongoose from 'mongoose';

// create a Phrase model
var Phrase = mongoose.model('Phrase', {
    text: Object,
    audio: Object,
    analogs: [],
    enabled: Boolean,
    created: { type: Date, default: Date.now },
});

export default Phrase;