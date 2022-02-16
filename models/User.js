const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'What is your name?'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: [true, 'Your email must be unique!'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    trim: true,
    min: 6,
  },
});

module.exports = mongoose.model('User', userSchema);
