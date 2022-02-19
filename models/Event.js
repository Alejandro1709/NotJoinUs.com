const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Your event must have a name'],
    trim: true,
    unique: [true, 'There is already an event with that name'],
  },
  eventCategory: {
    type: String,
    required: [true, 'You must specify a category for your event'],
    enun: [
      'arte-&-cultura',
      'cine',
      'comida-&-bebidas',
      'conciertos',
      'cursos-y-talleres',
      'deportes',
      'donacion',
      'entretenimiento',
      'festivales',
      'fiestas',
      'ninos',
      'salud-y-bienestar',
      'seminarios-y-conferencias',
      'servicios-comunitarios',
      'stand-up',
      'teatro',
      'tecnologia',
      'tiendas',
      'viajes-&-aventuras',
    ],
  },
  eventDescription: {
    type: String,
    required: [true, 'Your event must have a description'],
    trim: true,
  },
  eventAdditionalInfo: {
    type: String,
    default: 'N/A',
    trim: true,
  },
  eventSlug: {
    type: String,
  },
  eventPublicURL: {
    type: String,
  },
  eventImageURL: {
    // Hacer campo como requerido luego
    url: String,
    filename: String,
  },
  eventStartDate: {
    type: Date,
    required: [true, 'You must specify a start date for your event'],
    default: Date.now,
  },
  eventEndDate: {
    type: Date,
    required: [true, 'You must specify an end date for your event'],
    default: Date.now,
  },
  eventAddress: {
    type: String,
    required: [true, 'Your event must have an address'],
    trim: true,
  },
  eventOwner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

eventSchema.pre('save', function () {
  this.eventSlug = slugify(this.eventName).toLowerCase();
  this.eventPublicURL = `http://localhost:2002/events/${this.eventSlug}`;
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
