'use strict';

var express =           require('express'),
    http =              require('http'),
    passport =          require('passport'),
    path =              require('path'),
    morgan =            require('morgan'),
    bodyParser =        require('body-parser'),
    methodOverride =    require('method-override'),
    cookieParser =      require('cookie-parser'),
    session =           require('express-session'),
    csrf =              require('csurf'),
    errorHandler =      require('errorhandler'),
    config =            require('./lib/config.js'),
    mongoose =          require('mongoose');

require('express-namespace');

//Make connection to the mongo database
require('./lib/connection');

//Bootstrap models
require('./app/users/user-models');

//Get the user model
var User = require('./app/users/user-models.js');

var app = module.exports = express();

//Express middleware
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({secret: "keyboard cat"}));

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

//A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

//Setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

//Log current user information to the console
app.use(function (req, res, next) {
    if (req.user) {
        console.log('Current User: '.grey + '%s', req.user.username);
    } else {
        console.log('Unauthenticated'.blue);
    }
    next();
});

//Routes
require('./app/users/user-routes')(app);
require('./app/app-routes/authorization.js')(app);

//HTML5 Mode (needs to be the last route added)
require('./app/app-routes/html5mode').addRoutes(app, config);

//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});