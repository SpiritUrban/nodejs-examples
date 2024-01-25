import mongoose from 'mongoose';

// create a Room model
var Room = mongoose.model('Room', {
    number: String,
    availability: String,
    speaker: {
        ip: String,
        id: String,
        isSocketConnection: Boolean,
        lastResponse: { type: Date, default: Date.now },
        previousResponse: { type: Date, default: Date.now },
    },
    created: { type: Date, default: Date.now },
});

export default Room;