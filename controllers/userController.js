const User = require('./../models/userModel');
const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');
const mongoose = require('mongoose');

// Render the log in page
exports.getLogInForm = (req, res) => {
    res.status(200).render('pages/login.ejs');
}

// Render the sign up page
exports.getSignupForm = (req, res) => {
    res.status(200).render('pages/signup.ejs');
}

// Get the user profile and the posts that user has been uploaded
exports.getProfile = catchAsync(async (req, res) => {
    const profile = await User.findById(req.user.id);
    let posts = [];
    let newArray = [];

    if (profile.userPosts != null || profile.userPosts != undefined) {

        const postIdArray = profile.userPosts;

        //Read the post in the array
        if (postIdArray.length == 1) {
            let specificPost = await Post.findById(postIdArray[0]);
            posts.push(specificPost);
        } else {
            for (let i = postIdArray.length - 1; i >= 0; i--) {
                newArray.push(mongoose.Types.ObjectId(postIdArray[i]));
            }

            for (let i = 0; i < newArray.length; i++) {
                let specificPost = await Post.findById(newArray[i]);
                posts.push(specificPost);
            }
        }

    }
    res.status(200).render('pages/userprofile.ejs', {
        posts
    });
});