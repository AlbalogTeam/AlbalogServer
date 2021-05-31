import mongoose from "mongoose";

const timestampSchema = mongoose.Schema({

    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    wage: {
        type: mongoose.Types.ObjectId, // ?? wage가 타입이 ObjectId?
    },
    total: {
        type: Number,
    }

});

const timestamp = mongoose.model('Timestamp', timestampSchema);

module.exports = timestamp;