const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Success');
  } catch (error) {
    console.log(error);
    console.log('MongoDB Connected Fail');
  }
};

module.exports = connectDB;
