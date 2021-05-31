import mongoose from "mongoose";

const scheduleSchema = mongoose.Schema({
    date: {
        type:Date
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    employee: {
        type: mongoose.Types.ObjectId
    }
});

const schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = schedule;