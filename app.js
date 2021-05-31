import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
dotenv.config('./config/');
import morgan from 'morgan';
import noticeRouter from "./routers/noticeRouter";

import employerRouter from './routers/employerRouter';
import ping from './routers/ping';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use(process.env.BASE_URL, employerRouter);
app.use(process.env.BASE_URL, ping);

app.use(`${process.env.BASE_URL}/notice`, noticeRouter)

module.exports = app;
