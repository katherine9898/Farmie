const AppError = require('./../utils/appError');

/**
 * Handle cast error of database.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} err 
 */
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

/**
 * Handle duplicate error of database.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} err 
 */
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please enter another value.`;
    return new AppError(message, 400);
};

/**
 * Handle validation error of database.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} err 
 */
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Handle JWT error.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/ 
 */
const handleJWTError = () => {
    new AppError('Please log in again!', 401);
};

/**
 * Handle JWT error.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/ 
 */
const handleJWTExpiredError = () => {
    new AppError('Please log in again!', 401);
}

/**
 * Render error page for development environment
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} err 
 * @param {*} req
 * @param {*} res
 */
const sendErrorDev = (err, req, res) => {
    console.error('Error', err);
    return res.status(err.statusCode).render('pages/errorPage.ejs', {
        msg: err.message
    });
};

/**
 * Render error page for development environment
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} err 
 * @param {*} req
 * @param {*} res
 */
const sendErrorProd = (err, req, res) => {
    // 1. Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('pages/errorPage.ejs', {
            msg: err.message
        });
    }

    // 2. Programming or other unknown error
    console.error("Error: ", err);
    return res.status(err.statusCode).render('pages/errorPage.ejs', {
        msg: "Please try again later"
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {
            ...err
        };
        error.message = err.message;

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }

        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }

        sendErrorProd(error, req, res);
    }
}