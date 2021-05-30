import express from 'express';
import './db/mongoose';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';

import employerRouter from './routers/employerRouter';
import ping from './routers/ping';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', employerRouter);
app.use('/api/v1', ping);

module.exports = app;
