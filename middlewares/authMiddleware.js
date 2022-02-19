const Event = require('../models/Event');

const protect = (req, res, next) => {
  if (!req.session.user_id) {
    req.flash('error', 'You must be logged in.');
    return res.redirect('/');
  }
  next();
};

const isEventOwner = async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventSlug: req.params.slug });

    if (!event.eventOwner.equals(req.session.user_id)) {
      req.flash('error', 'This event does not belong to you.!');
      return res.redirect('/');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, isEventOwner };
