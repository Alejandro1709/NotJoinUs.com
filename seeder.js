const connectDB = require('./config/connectDB');
const path = require('path');
const fs = require('fs');
const Event = require('./models/Event');

connectDB();

const deleteData = async () => {
  try {
    await Event.deleteMany({});

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const events = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/data/events.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Event.create(events);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
