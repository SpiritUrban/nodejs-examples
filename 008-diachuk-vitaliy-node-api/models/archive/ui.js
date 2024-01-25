import mongoose from 'mongoose';

// create a Ui model
var Ui = mongoose.model('Ui', {
    uiContext: { type: String, index: true, required: true, unique: true },
    all : Object,
});

export default Ui;