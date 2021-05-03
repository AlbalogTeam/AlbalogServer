import mongoose from "mongoose";
require('dotenv').config();

mongoose
    .connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected.... "))
    .catch((err) => console.log(err)
    );