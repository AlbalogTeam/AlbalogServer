const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });
mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected.... '))
  .catch((err) => console.log(err));
