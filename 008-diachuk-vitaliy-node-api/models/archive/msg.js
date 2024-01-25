import mongoose from 'mongoose';

// create a Msg model
var Msg = mongoose.model('Msg', {
    type: String,
    text: Object,
    phraseId: String,
    phrase: Object,
    from: String, // _id of user
    to: String, // _id of user
    flow: String, // visitor _id message flow
    checked: { type: Boolean, default: false },
    checkedBy: String,
    checkedTime: Date,
    checkedSpeed: String,
    solved: { type: Boolean, default: false },
    solvedBy: String,
    solvedTime: Date,
    solvedSpeed: String,
    created: { type: Date, default: Date.now },
});

export default Msg;