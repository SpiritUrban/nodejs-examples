import mongoose from 'mongoose';

// create a Task model
var Task = mongoose.model('Task', {
    type: String,
    to: String, // _id of user
    creator: String, // _id of user
    adId: String,
    hour: String,
    minute: String,
    day: String,
    month: String,
    year: String,
    date: Date,
    monthNumber: String,
    advertising: Object,
    text: String,
    done: Boolean,
    created: { type: Date, default: Date.now },
});

export default Task;