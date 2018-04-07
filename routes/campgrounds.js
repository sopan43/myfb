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

//Edit
router.get('/:id/edit', checkOwnership, (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//Update
router.put('/:id', checkOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.capmground, (err, data) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

//Destroy
router.delete('/:id', checkOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

function checkOwnership(req, res, next) {
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

module.exports = router;