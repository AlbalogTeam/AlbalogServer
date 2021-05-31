import mongoose from "mongoose";

const credentialSchema = mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }

});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = Credential;
