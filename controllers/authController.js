const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

/**
 * Creates a new token for user id.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} id 
 */
const signToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

/**
 * Creates and sends the token to the cookie.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 * @param {*} user 
 * @param {*} statusCode 
 * @param {*} res 
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

/**
 * Gets the data and upload it to the database
 */
exports.signUp = async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        country: req.body.country,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    newUser.save().then(doc => {
        createSendToken(doc, 200, res);
    }).catch((err) => {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    })
};

/**
 * Compares the information that user enters with the data on database.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
exports.logIn = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // 1. Check if the email and password exist
    if (!email || !password) {
        return next(new AppError('All the fields must be filled', 400));
    }

    console.log("Account exists");

    // 2. Check if user exists && password is correct
    const user = await User.findOne({
        email
    }).select('+password');

    console.log("Get user");
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

/**
 * Checks if the user logged in or not to protect the routes.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Getting the token 
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    //Check if token exists
    if (!token) {
        return next(new AppError('You have to log in to get access.', 401));
    }

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user does not exist', 401));
    }
    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, please log in again!'), 401);
    }

    //Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;

    next();

});

/**
 * Creates a new token that expires in 1 second and send it to cookie
 * when user logs out.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/ 
 */
exports.logOut = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    });
};