import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
    status: {
        type: String,
    },
    credentials: [
        {
            credential: {
                type: mongoose.Types.ObjectId,
                // required
                ref: 'Credential',
            },
        },
    ],
    //birthdate,
    totalWage: {
        type: Number,
    },
    wage: {
        type: Number,
    },

});

const employee = mongoose.model('Employee', employeeSchema);

export default employee;