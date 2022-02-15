const express = require('express');
const path = require('path');
const Event = require('./models/Event');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const methodOverride = require('method-override');
const AppError = require('./utils/AppError');
const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/events', require('./routes/event.routes'));

// HOME SCREEN
app.get('/', async (req, res) => {
  const events = await Event.find();

  res.render('home', {
    events,
  });
});

//GET SINGLE EVENT
app.get('/events/:slug', async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventSlug: req.params.slug });

    if (!event) {
      throw next(new AppError(404, 'This Event Does Not Exists!'));
    }

    res.render('detail', {
      event,
    });
  } catch (error) {
    next(error);
  }
});

// CREATE EVENT
app.get('/create', (req, res) => {
  res.render('create');
});

//EDIT EVENT
app.get('/events/:slug/edit', async (req, res) => {
  try {
    const event = await Event.findOne({ eventSlug: req.params.slug });

    if (!event) {
      throw next(new AppError(404, 'This Event Does Not Exists!'));
    }

    res.render('edit', {
      event,
    });
  } catch (error) {
    next(error);
  }
});

// NOT FOUND Middleware
app.all('*', (req, res, next) => {
  next(new AppError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';

  res.status(status).send(err.message);
});

const port = process.env.PORT || 2002;

app.listen(port, () =>
  console.log(`Server is live at: http://localhost:${port}`)
);
