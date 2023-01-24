// Express application
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Global middlewares
// Set security HTTP headers
app.use(helmet());

// Logging in dev
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate limiting feature
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour limit
  message: 'Too many requests from this IP, Please try again in 1 hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanization against NoSQL query injection
app.use(mongoSanitize());

// Data sanization against Cross Site Scripting
app.use(xss());

//
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
