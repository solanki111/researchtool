var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var TaskOrder = require('../schema/taskorder');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {



    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {

                    TaskOrder.find({ users: { "$in": [user.email] } }).exec(function(err, taskorders) {
                        if (err) {
                            return next(err);
                        } else {
                            return res.render('profile', { username: user.username, user: user });
                        }




                    });



                }
            }
        });

});



router.post('/update', function(req, res, next) {

    console.log();

    User.findOneAndUpdate({ _id: req.session.userId }, { $set: { username: req.body.username, age: req.body.age, gender: req.body.gender } }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
            next(err);
        } else {
            res.redirect('/editprofile');
        }


    });

});

//Change password of the user
router.post('/password', function(req, res, next) {

    if (req.body.n_password == req.body.c_password) {

        User.findOne({ _id: req.session.userId }, function(err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
                next(err);
            } else {

                bcrypt.compare(req.body.o_password, doc.password, function(err, result) {

                    if (result) {
                        bcrypt.hash(req.body.n_password, 10, function(err, hash) {
                            if (err) {
                                return next(err);
                            }
                            doc.password = hash;

                            User.findOneAndUpdate({ _id: req.session.userId }, { $set: { password: hash } }, { new: true });
                        })
                    };


                });


                res.redirect('/editprofile');
            }


        });

    } else {

        return next();
    }





});

module.exports = router;