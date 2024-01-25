import mongoose from 'mongoose';

// create a Msg model
var ChatMsg = mongoose.model('ChatMsg', {
    type: String, // type of user
    path: String, // path to audio file of message
    text: Object,
    from: String, // _id of user
    to: String, // _id of user
    checked: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
});

export default ChatMsg;