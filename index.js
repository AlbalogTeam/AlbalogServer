import express from 'express';
import morgan from 'morgan';
import './db/mongoose';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(morgan('dev'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
