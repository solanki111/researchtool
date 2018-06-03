var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var nodemailer = require('nodemailer');

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

    return res.sendFile(path.join(__dirname + '/public/indexresearcher.html'));
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

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf &&
        req.body.age &&
        req.body.gender) {



        req.body.researcher = true;



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
                    html: '<a href="http://http://52.19.47.101:3000/verifyemail/' + user._id + '"> Click to verify<a/>'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log("Email ERROR :::::  " + error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


                req.session.userId = null;
                return res.redirect('/emailverification');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
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
                        return res.redirect('/dashboard');
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