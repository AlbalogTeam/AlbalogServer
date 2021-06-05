import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    locationId: {
        type: mongoose.Types.ObjectId,
        ref: 'Employer',
        required: true,
    },
    name: {
        type: String,
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;