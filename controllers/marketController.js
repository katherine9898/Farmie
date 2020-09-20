const Post = require('./../models/postModel');
const Fruits = require('./../models/fruitModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const mongoose = require('mongoose');

/**
 * Upload picture of fruit for the post.
 * I was follow the tutorial on Udemy to write this function.
 * @see https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/
 */
const multer = require('multer');
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/post');
    },
    filename: (req, file, cb) => {
        //ex: post-2ewe2-234.jpeg
        const ext = file.mimetype.split('/')[1];
        cb(null, `post-${req.user.id}-${Date.now()}.${ext}`);
    }
});

//prevent user post other file not image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Please upload only images', 400), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto = upload.single('photo');

/**
 * Get all the post data on database and display it.
 */
exports.getAllPosts = catchAsync(async (req, res) => {

    const posts = await Post.find().sort({
        time: -1
    });

    res.status(200).render('pages/marketplace.ejs', {
        title: 'Market',
        posts
    });
});

/**
 * Get the data of the post that match with parameter,
 * and display the posts.
 */
exports.findPosts = catchAsync(async (req, res) => {
    console.log("redirect successfully");

    //get postId array from fruits collection
    const docFruit = await Fruits.findOne({
        name: (req.params.fruit).toLowerCase()
    });
    let posts = [];
    let newArray = [];

    if (docFruit != null || docFruit != undefined) {
        const postIdArray = docFruit.postId;

        //Read the post in the array
        for (let i = postIdArray.length - 1; i >= 0; i--) {
            newArray.push(mongoose.Types.ObjectId(postIdArray[i]));
        }

        for (let i = 0; i < newArray.length; i++) {
            let specificPost = await Post.findById(newArray[i]);
            posts.push(specificPost);
        }

    }

    res.status(200).render('pages/findPost.ejs', {
        title: 'Market',
        result: newArray.length,
        posts
    });
});

/**
 * Render the post form page.
 */
exports.showForm = (req, res) => {
    try {
        res.status(200).render('pages/postpage.ejs');
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

/**
 * Redirect to the new url to search for the posts.
 */
exports.getSearchUrl = (req, res) => {
    let itemName = req.body.search;
    let url = "/marketplace/search/" + itemName;
    try {
        res.redirect(url);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

/**
 * Add the fruit name to an array if the checkbox 
 * on the form is checked.
 * @param {*} obj 
 * @param {*} fruits 
 */
function checkFruit(obj, fruits) {
    if (obj.mango) {
        fruits.push("Mango");
    }

    if (obj.pomelo) {
        fruits.push("Pomelo");
    }

    if (obj.coconut) {
        fruits.push("Coconut");
    }

    if (obj.papaya) {
        fruits.push("Papaya");
    }

    if (obj.longan) {
        fruits.push("Longan");
    }

    if (obj.durian) {
        fruits.push("Durian");
    }

}

/**
 * Get data from the form and upload it on database.
 */
exports.uploadPosts = catchAsync(async (req, res) => {
    if (req.file == undefined) {
        res.render('pages/postpage.ejs', {
            msg: 'Error: No file upload'
        });
    }
    let obj = req.body;

    let quantity = obj.estQuantity;
    console.log(quantity);
    let descript = obj.description;
    console.log(descript);
    let timestamp = new Date();
    let photoName;
    let fruits = [];
    checkFruit(obj, fruits);

    if (req.file) {
        photoName = req.file.filename;
    }
    console.log(fruits);
    console.log(req.user.id);
    const newPost = new Post({
        products: fruits,
        quantity: quantity,
        description: descript,
        time: timestamp,
        userId: req.user.id,
        userName: req.user.name,
        userCountry: req.user.country,
        photo: photoName
    });

    newPost.save().then(async (docRef) => {
        // push post id into documents of the fruit collection
        for (let i = 0; i < fruits.length; i++) {
            let fruitObj = await Fruits.findOne({
                name: fruits[i].toLowerCase()
            });

            let fruitPostId = fruitObj.postId;

            if (fruitPostId == undefined || fruitPostId == null) {
                fruitPostId = [];
            }

            fruitPostId.push(docRef._id);

            Fruits.findOneAndUpdate({
                name: fruits[i].toLowerCase()
            }, {
                postId: fruitPostId
            }).then((doc) => {
                console.log(doc);
            }).catch((err) => {
                console.log(err);
            });
        }

        //Push the post id into user document.
        let curUser = await User.findById(req.user.id);
        let newPostArray = curUser.userPosts;
        newPostArray.push(docRef._id);

        User.findByIdAndUpdate({
            _id: req.user.id
        }, {
            userPosts: newPostArray
        }).then((doc) => {
            console.log(doc);
        }).catch((err) => {
            console.log(err);
        });

        res.redirect('/marketplace');
    }).catch(err => console.log(err));

});