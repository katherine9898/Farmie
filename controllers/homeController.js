const marketPrice = require('../models/marketPriceModel');
const catchAsync = require('./../utils/catchAsync');
/**
 * Gets the data from database and display it on the homepage.
 */
exports.showMarketPrice = catchAsync(async (req, res) => {

    let totalDoc = await marketPrice.countDocuments();

    const fruits = await marketPrice.findOne({
        _id: {
            $in: [totalDoc]
        }
    });

    res.status(200).render('pages/homepage.ejs', {
        fruits: fruits
    });
});

/**
 * Renders the about-us page.
 */
exports.getAboutUs = (req, res) => {
    res.status(200).render('pages/aboutUs.ejs');
}