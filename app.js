import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import noticeRouter from "./routers/noticeRouter";
import workManualRouter from "./routers/workManualRouter.js";
import employerRouter from './routers/employerRouter';
import locationRouter from './routers/locationRouter';
import ping from './routers/ping';

dotenv.config('./config/');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use(process.env.BASE_URL, employerRouter);
app.use(process.env.BASE_URL, ping);

app.use(`${process.env.BASE_URL}/notice`, noticeRouter);
app.use(`${process.env.BASE_URL}/manual`, workManualRouter);
app.use(`${process.env.BASE_URL}/location`, locationRouter)
//routes
// app.use(`${process.env.BASE_URL}/owner`);
// app.use('/api/v1/employer');

module.exports = app;
