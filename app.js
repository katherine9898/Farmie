const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit the requests from the same IP address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Please try again in an hour because this IP has too many request"
});
app.use('/login', limiter);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
    res.status(404).render('pages/page404.ejs');
});

app.use(globalErrorHandler);

module.exports = app;