import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import noticeRouter from "./routers/noticeRouter";
import workManualRouter from "./routers/workManualRouter.js";
import employerRouter from './routers/employerRouter';
import employeeRouter from './routers/employeeRouter';
import locationRouter from './routers/locationRouter';
import showUser from './routers/showUserRouter';
import ping from './routers/ping';

dotenv.config('./config/');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use(process.env.BASE_URL, ping);

app.use(`${process.env.BASE_URL}/notice`, noticeRouter);
app.use(`${process.env.BASE_URL}/manual`, workManualRouter);
app.use(`${process.env.BASE_URL}/location`, locationRouter)
//routes

app.use('/api/v1/owner', employerRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/showUser', showUser);

module.exports = app;
