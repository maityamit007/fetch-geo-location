const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { locationRouter } = require('./routes/location.route.js');
const cors = require('cors');
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log("Caused an error though my man",err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.options('*', cors())
app.use('/api/location', locationRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});