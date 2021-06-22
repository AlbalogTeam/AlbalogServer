import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import commonRouter from './routers/commonRouter';
import employerRouter from './routers/employerRouter';
import employeeRouter from './routers/employeeRouter';
import locationRouter from './routers/locationRouter';
import categoryRouter from './routers/categoryRouter';
import transitionRouter from './routers/transitionRouter';
import timeClockRouter from './routers/timeClockRouter';
import shiftRouter from './routers/shiftRouter';

dotenv.config('./config/env');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//common
app.use('/api/v1', commonRouter);

//routes
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/owner', employerRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/shift', shiftRouter);
app.use('/api/v1/transition', transitionRouter);
app.use('/api/v1/timeclock', timeClockRouter);

module.exports = app;
