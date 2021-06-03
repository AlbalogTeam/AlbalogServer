import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';

import employerRouter from './routers/employerRouter';
import employeeRouter from './routers/employeeRouter';
import locationRouter from './routers/locationRouter';
import ping from './routers/ping';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/v1/owner', employerRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1', ping);
app.use('/api/v1/location', locationRouter);

module.exports = app;
