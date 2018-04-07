var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlevareObj = {};

middlevareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                res.render('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
};

middlevareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                res.render('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
};

middlevareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};


module.exports = middlevareObj