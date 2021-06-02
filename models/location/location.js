import mongoose from 'mongoose';
import Board from "./board.js";

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        postal_code: {
            type: String,
            required: true,
            trim: true,
        },
        phone_number: {
            type: String,
            required: true,
            trim: true,
        },
        employees: [
            {
                employee: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: 'Employee',
                },
            },
        ],
        board: {
            type: mongoose.Types.ObjectId,
            ref: 'Board',
        },
        schedule_changes: [
            {
                schedule_change: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                },
            },
        ],
        transitions: [
            {
                transition: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

locationSchema.pre('save', async function (next) {

    const location = this;

    try {

        const board = new Board();
        const {_id} = board;

        if(!board) {
            throw new Error('Cannot Create Board');
        }

        await board.save();

        location.board = _id;

        next();
    }catch (err) {
        throw err;
    }
});

const Location = mongoose.model('location', locationSchema);

module.exports = Location;