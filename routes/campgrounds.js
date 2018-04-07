var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
            res.redirect('/campgrounds');
        }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/show', { campground: data });
        }
    });
});

//Edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//Update
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.capmground, (err, data) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

//Destroy
router.delete('/:id', middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});



module.exports = router;