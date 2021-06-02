import mongoose from "mongoose";

const noticeSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 50,
        required: true
    },
    content: {
        type: String,
        required:true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Employer",
        required: true
    }
}, {
    timestamps: true
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
