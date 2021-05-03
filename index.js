import express from 'express';

require('./db/mongoose');
require('dotenv').config();

import morgan from 'morgan';


const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`서버가 시작했습니다. http://localhost:${PORT}`);
});