var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', (req, res) => {
    res.render('landing');
});

//============
//Auth Routes
//============

//register
router.get('/register', (req, res) => {
    res.render('register');
});

//POST Register
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, () => {
                return res.redirect('/campgrounds');
            });
        }
    });
});


//Login
router.get('/login', (req, res) => {
    return res.render('login', { currentUser: req.user });
});

//POST Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = router;