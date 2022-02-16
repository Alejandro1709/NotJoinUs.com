const express = require('express');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find();

  res.status(200).json(events);
});

router.get('/:slug', async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventSlug: req.params.slug });

    if (!event) {
      throw next(new AppError(404, 'This Event Does Not Exists!'));
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const {
    eventName,
    eventCategory,
    eventDescription,
    eventAdditionalInfo,
    eventImageURL,
    eventStartDate,
    eventEndDate,
    eventAddress,
  } = req.body;

  let event = new Event({
    eventName,
    eventCategory,
    eventDescription,
    eventAdditionalInfo,
    eventImageURL,
    eventStartDate,
    eventEndDate,
    eventAddress,
  });

  try {
    const createdEvent = await event.save();

    req.flash('success', 'Evento Creado!');

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.patch('/:slug', async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { eventSlug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      throw next(new AppError(404, 'This Event Does Not Exists!'));
    }

    req.flash('success', 'Evento Actualizado!');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.delete('/:slug', async (req, res) => {
  await Event.findOneAndDelete({ eventSlug: req.params.slug });

  req.flash('success', 'Evento eliminado!');
  res.redirect('/');
});

module.exports = router;
