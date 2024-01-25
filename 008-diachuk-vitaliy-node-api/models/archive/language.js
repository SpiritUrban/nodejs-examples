import mongoose from 'mongoose';

// create a Language model
var Language = mongoose.model('Language', {
    enabled: Boolean,
    code: String,
    created: { type: Date, default: Date.now },
});

export default Language;