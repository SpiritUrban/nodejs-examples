import mongoose from 'mongoose';

var SuperTask = mongoose.model('SuperTask', {
    aim: String,
    aimCoordinates: String,
    type: String,
    need: String,
    done: Boolean,
    status: String,
    created: { type: Date, default: Date.now },
});

export default SuperTask;