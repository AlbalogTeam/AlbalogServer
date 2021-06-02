import mongoose from "mongoose";
import Board from "./board";
import Category from "../workManual/category.js";

const workManualSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 50,
        required: true
    },
    content: {
        type: String,
        required:true
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }
}, {
    timestamps: true
});

workManualSchema.pre('save', async function (next) {

    const workManual = this;

    try {

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

const WorkManual = mongoose.model("WorkManual", workManualSchema);

export default WorkManual;