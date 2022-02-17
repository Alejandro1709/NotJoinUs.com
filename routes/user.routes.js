const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      throw next(new AppError(401, 'Inavlid Email Or Password!'));
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      req.session.user_id = user._id;
      req.session.save();
      req.flash('success', 'You are now Logged in!');
      res.redirect('/');
    } else {
      throw next(new AppError(401, 'Inavlid Email Or Password!'));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  const { firstName, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  let user = new User({
    firstName,
    email,
    password: hash,
  });
  try {
    const savedUser = await user.save();
    req.session.user_id = savedUser._id;
    req.session.save();
    req.flash('success', 'You are now Logged in!');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
