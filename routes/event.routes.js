const express = require('express');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { protect, isEventOwner } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const router = express.Router();

const geocoding = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

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

router.post(
  '/',
  protect,
  upload.single('eventImageURL'),
  async (req, res, next) => {
    const {
      eventName,
      eventCategory,
      eventDescription,
      eventAdditionalInfo,
      eventStartDate,
      eventEndDate,
      eventAddress,
    } = req.body;

    const geoData = await geocoding
      .forwardGeocode({
        query: eventAddress,
        limit: 1,
      })
      .send();

    let event = new Event({
      eventName,
      eventCategory,
      eventDescription,
      eventAdditionalInfo,
      eventImageURL: {
        url: req.file.path,
        filename: req.file.filename.split('/')[1],
      },
      eventStartDate,
      eventEndDate,
      eventAddress,
      geometry: geoData.body.features[0].geometry,
      eventOwner: req.session.user_id,
    });

    try {
      const createdEvent = await event.save();

      req.flash('success', 'Evento Creado!');

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:slug',
  protect,
  isEventOwner,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const event = await Event.findOneAndUpdate(
        { eventSlug: req.params.slug },
        {
          eventImageURL: {
            url: req.file.path,
            filename: req.file.filename.split('/')[1],
          },
          ...req.body,
        },
        { new: true, runValidators: true }
      );

      if (!event) {
        req.flash('This event does not exists!');
        return res.redirect('/');
      }

      req.flash('success', 'Evento Actualizado!');
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:slug', protect, isEventOwner, async (req, res) => {
  await Event.findOneAndDelete({ eventSlug: req.params.slug });

  req.flash('success', 'Evento eliminado!');
  res.redirect('/');
});

module.exports = router;
