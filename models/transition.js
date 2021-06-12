import mongoose from 'mongoose';

const transitionSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            required: true,
            default: false
        }
    }
);

const Transition = mongoose.model('Transition', transitionSchema);

module.exports = Transition;
