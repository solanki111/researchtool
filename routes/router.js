var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var nodemailer = require('nodemailer');
var promise = require('promise');
var Study = require('../schema/study');

var dashboardRouter = require('./dashboard');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maynoothresearchtool@gmail.com',
        pass: 'janaganamana'
    }
});



// GET route for reading data
router.get('/', function(req, res, next) {

    if (req.session.userId) {
        console.log('Redirecting to Dashboard');
        return res.redirect('/dashboard');
    } else {
        console.log('Redirecting to Login');
        return res.sendFile(path.join(__dirname + '/public/index.html'));
    }

});







//POST route for updating data
router.post('/', function(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    //Signup process
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf &&
        req.body.age &&
        req.body.gender) {


        if (req.body.researcher) {
            req.body.researcher = true;
            req.session.researcher = true;
        } else {
            req.body.researcher = false;
            req.session.researcher = false;
        }


        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
            age: req.body.age,
            gender: req.body.gender,
            researcher: req.body.researcher

        }

        User.create(userData, function(error, user) {
            if (error) {
                return next(error);
            } else {



                var mailOptions = {
                    from: 'maynoothresearchtool@gmail.com',
                    to: req.body.email,
                    subject: 'Maynooth Research Tool Account Verification',
                    text: 'Please click on the link below',
                    html: '<a href="http://ec2-52-19-47-101.eu-west-1.compute.amazonaws.com:3000/verifyemail/' + user._id + '"> Click to verify<a/>'

                };

                //Sending the verification email right after the signup
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log("Email ERROR :::::  " + error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


                //Creating the study 
                var studyData = {
                    researcherID: req.session.userId,
                    name: "Sandbox",
                    deleteable: false
                };

                Study.create(studyData, function(error, study) {

                    if (error) {

                        console.log(error);
                        return next(error);
                    } else {

                        console.log(study);

                        req.session.userId = null;
                        return res.redirect('/emailverification');

                    }

                });





            }
        });

    } //Login Process 
    else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {




            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            }



            User.findOne({ email: req.body.logemail })
                .exec(function(err, usr) {




                    if (err) {
                        var err = new Error('Something went wrong while Verifying');
                        err.status = 401;
                        return next(err);
                    }

                    if (usr.emailVerified) {

                        req.session.userId = user._id;

                        req.session.researcher = user.researcher;



                        if (user.researcher) {
                            return res.redirect('/dashboard');

                        } else {

                            return res.redirect('/home');
                        }




                    } else {

                        req.session.userId = null;
                        return res.redirect('/emailverification');
                    }



                });




        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})









// GET route after registering
router.get('/dashboard', dashboardRouter);

// GET for logout logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;