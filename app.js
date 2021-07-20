const express = require('express');
require('./db/mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const commonRouter = require('./routers/commonRouter');
const employerRouter = require('./routers/employerRouter');
const employeeRouter = require('./routers/employeeRouter');
const locationRouter = require('./routers/locationRouter');
const workManualRouter = require('./routers/workManualRouter');
const noticeRouter = require('./routers/noticeRouter');
const categoryRouter = require('./routers/categoryRouter');
const transitionRouter = require('./routers/transitionRouter');
const timeClockRouter = require('./routers/timeClockRouter');
const shiftRouter = require('./routers/shiftRouter');

dotenv.config('./config/env');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// common
app.use('/api/v1', commonRouter);

// routes
app.use('/api/v1/category', categoryRouter);
app.use(
  '/api/v1/location',
  locationRouter,
  workManualRouter,
  noticeRouter);

app.use('/api/v1/owner', employerRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/shift', shiftRouter);
app.use('/api/v1/transition', transitionRouter);
app.use('/api/v1/timeclock', timeClockRouter);

module.exports = app;
