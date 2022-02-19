const protect = (req, res, next) => {
  if (!req.session.user_id) {
    req.flash('error', 'You must be logged in.');
    return res.redirect('/');
  }
  next();
};

module.exports = protect;
