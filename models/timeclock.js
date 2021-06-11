import mongoose from 'mongoose';

const timeClockSchema = new mongoose.Schema(
    {
        start_ime: {
            type: Date,
            required: true
        },
        end_time: {
            type: Date,
            required: true
        },
        wage: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }
);

const TimeClock = mongoose.model('TimeClock', timeClockSchema);

module.exports = TimeClock;