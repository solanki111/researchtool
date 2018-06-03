/*
 * To generate web page whenever there is error
 */
var createError = require('http-errors');

// ExpressJS is used as the framework for REST end points and aso to render pages
var express = require('express');

//Used to reference the local paths and to help host the static files
var path = require('path');

//Framework to manage cookies
var cookieParser = require('cookie-parser');

//Framework used to log on the server side
var logger = require('morgan');

//Using mongoose instead of mongodb's default framework.
//Mongoose  cuts down a lot of boilerplate codes.
var mongoose = require('mongoose');

//Express sessions is to handle sessions between different users
var session = require('express-session');

//This module is used to maintain mongodb sessions with express
var MongoStore = require('connect-mongo')(session);

//To parse the request body to JSON for simplicity of handling requests
var bodyParser = require('body-parser');

//connect to MongoDB
mongoose.connect('mongodb://localhost/authentication');
var db = mongoose.connection;

/**
 * The below code is to set import all the files that is linked to the routes user navigates to
 */
var researcherRouter = require('./routes/researcherrouter');
var indexRouter = require('./routes/index');
var router = require('./routes/router');
var usersRouter = require('./routes/users');
var emailVerificationRouter = require('./routes/verifyemail');
var dashboardRouter = require('./routes/dashboard');
var homeRouter = require('./routes/home');
var userTasksRouter = require('./routes/usertasks');
var studyRouter = require('./routes/study');
var studiesRouter = require('./routes/studies');
var tasksRouter = require('./routes/tasks');
var experimentsRouter = require('./routes/experiments');
var profileRouter = require('./routes/profile');


//Initialise express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Log every request ever made by the client to the server
app.use(logger('dev'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {

    next();
});






//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'abhideepak',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//Few paths are only allowed for the researcher to navigate
//due to security issues
//This function below checks for requests and
//find if the user is a researcher and allows only in that case
//but does not allow the common user to navigate 
var researcherCheck = function(req, res, next) {

    if (!req.session.researcher) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
    } else {
        next();
    }

};


/**
 * set routes using the routers initialised before and set paths to access them.
 */
app.use('/', router);
app.use('/researcherAuthentication', researcherRouter);
app.use('/users', usersRouter);
app.use('/dashboard', studyRouter);
app.use('/home', homeRouter);
app.use('/usertasks', userTasksRouter);
app.use('/study', researcherCheck, studyRouter);
app.use('/studies', researcherCheck, studiesRouter);
app.use('/tasks', researcherCheck, tasksRouter);
app.use('/experiments', researcherCheck, experimentsRouter);
app.use('/editprofile', profileRouter);
app.use('/verifyemail', emailVerificationRouter);


//Authentication page for the researcher
app.get('/research', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/indexresearcher.html'));
});
//email verification page
app.get('/emailverification', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/erroremailverification.html'));
});


//Used to redirect the user depending if he is a researcher or not
app.get('/redirect', function(req, res) {

    if (req.session.researcher) {
        return res.redirect('/dashboard');
    } else {
        return res.redirect('/home');
    }

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;