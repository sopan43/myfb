var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlevareObj = {};

middlevareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash('error', ('Something Wrong, Try Again Later'));
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', ('Permission Denied'));
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', ('You need to be logged in'));
        res.redirect('back');
    }
};

middlevareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                req.flash('error', ('Something Wrong, Try Again Later'));
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', ('Permission Denied'));
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', ('You need to be logged in'));
        res.redirect('back');
    }
};

middlevareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
    	req.flash('error', ('You need to be logged in'));
        res.redirect('/login');
    }
};


module.exports = middlevareObj