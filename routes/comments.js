var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');


router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, data) => {
        if (err) {
            console.log('error');
        } else {
            res.render('comments/new', { campground: data });
        }
    });
});

router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log('err');
            redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log('err');
                } else {
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;

                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


//Edit comment
router.get('/:comment_id/edit', (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
             res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
   
});

//Update Comment
router.put('/:comment_id', (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
             res.redirect('/campgrounds/'+ req.params.id);
        }
    });
   
});

//Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = router;