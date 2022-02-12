const express = require('express');
const path = require('path');
const Event = require('./models/Event');
const connectDB = require('./config/connectDB');
const AppError = require('./utils/AppError');
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/v1/events', require('./routes/event.routes'));

// HOME SCREEN
app.get('/', async (req, res) => {
  const events = await Event.find();

  res.render('home', {
    events,
  });
});
// CREATE EVENT
app.get('/create', (req, res) => {
  res.render('create');
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

app.listen(2002, () => console.log('Server is live at: http://localhost:2002'));
