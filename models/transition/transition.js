import mongoose from 'mongoose';

const transitionSchema = mongoose.Schema({
    date: {
        type: Date,
    },
    comment: {
        type: String,
    },
    completed: {
        type: Boolean
    }
});

const transition = mongoose.model('Transition', transitionSchema);