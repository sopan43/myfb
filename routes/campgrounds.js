var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//INDEX - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/index', { campgrounds: data });
        }
    });
});

//CREATE - add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampground = { name: name, image: image, description: desc, author: author };

    Campground.create(newcampground, (error, data) => {
        if (error) {
            console.log('error');
        } else {
            console.log(data);
            res.redirect('/campgrounds');
        }
    });
});

//NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((error, data) => {
        if (error) {
            console.log('error');
        } else {
            res.render('campgrounds/show', { campground: data });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};


module.exports = router;