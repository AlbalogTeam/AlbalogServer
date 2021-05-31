import mongoose from 'mongoose';

const manualSchema = mongoose.Schema({
    title: {
        type:String,
        required: true,
        trim: true,
        maxLength:50
    },
    category: {

    },
    content: {
        type: String,
        required: true
    },
}, { timeStamp: true });

const Manual = mongoose.model('manual',manualSchema);

export default Manual;