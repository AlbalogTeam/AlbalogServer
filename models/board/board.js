import mongoose from 'mongoose';

const boardSchema = mongoose.Schema({
    notices: [
        {
            notice: {
                type: mongoose.Types.ObjectId
            }
        }
    ],
    manuals: [
        {
            manual: {
                type: mongoose.Types.ObjectId
            }
        }
    ]
});

const Board = mongoose.model('board',boardSchema);

export default Board;