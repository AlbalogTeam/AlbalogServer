import mongoose from "mongoose";

const workManual = mongoose.Schema({
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

const WorkManual = mongoose.model("WorkManual", workManual);

export default WorkManual;