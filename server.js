const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Global Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGTH EXCEPTION, Shutting down app');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

// Start server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Global Error handling for unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, Shutting down app');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
