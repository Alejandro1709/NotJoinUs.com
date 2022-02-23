const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
  try {
    let mainDB =
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_DEV
        : process.env.MONGO_URI_PROD;

    await mongoose.connect(mainDB);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
