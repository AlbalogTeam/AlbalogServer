import express from 'express';
import dotenv from "dotenv";
import "./db/mongoose.js";
import morgan from 'morgan';
import noticeRouter from "./routers/noticeRouter";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

// Middleware
app.use(morgan('dev'));
app.use('/notice', noticeRouter);

app.listen(PORT, () => {
    console.log(`서버가 시작했습니다. http://localhost:${PORT}`);
});