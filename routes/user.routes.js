const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      throw next(new AppError(401, 'Inavlid Email Or Password!'));
    }

    // const validPassword = await bcrypt.compare(password, user.password);

    if (user.matchPasswords(password, user.password)) {
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

  let user = new User({
    firstName,
    email,
    password,
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

router.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

module.exports = router;
