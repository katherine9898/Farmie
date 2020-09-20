/**
 * Renders the message page.
 */
exports.getPage = (req, res) => {
    res.status(200).render('pages/message.ejs');
}