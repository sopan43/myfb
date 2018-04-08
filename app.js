var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');

var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

mongoose.connect('mongodb://admin:admin123@ds111648.mlab.com:11648/yelp_camp');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());



//Passport Config
app.use(require('express-session')({
    secret: 'This is secratre KEY',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// var SeecDb = require('./seeds.js');
//  SeecDb();

//==========Routes========================================
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);



app.listen(3000, () => {
    console.log('3000');
});