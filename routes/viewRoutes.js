const express = require('express');
const marketController = require('../controllers/marketController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const messageController = require('../controllers/messageController');

const router = express.Router();
// Routes for the sign up page
router.get('/signup', userController.getSignupForm);
router.post('/signup', authController.signUp);

// Routes for the log in page
router.get('/login', userController.getLogInForm);
router.post('/login', authController.logIn);

// Route for the log out page
router.get('/logout', authController.logOut);

// Route for the user profile page
router.get('/mypage', authController.protect, userController.getProfile);

// Route for the about us page
router.get('/', homeController.getAboutUs);

// Route for the homepage
router.get('/home', authController.protect, homeController.showMarketPrice);

// Routes for the marketplace page
router.get('/marketplace', authController.protect, marketController.getAllPosts);
router.post('/marketplace', marketController.getSearchUrl);

// Routes for searching the post by fruit name
router.get('/marketplace/search/:fruit', authController.protect, marketController.findPosts);
router.post('/marketplace/search/:fruit', marketController.getSearchUrl);

// Routes for uploading the post
router.get('/marketplace/post', authController.protect, marketController.showForm);
router.post('/marketplace/post', authController.protect, marketController.uploadPhoto, marketController.uploadPosts);

// Routes for the message page
router.get('/message', authController.protect, messageController.getPage);

module.exports = router;