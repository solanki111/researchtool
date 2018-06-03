var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var TaskOrder = require('../schema/taskorder');


router.get('/', function(req, res, next) {

    //Only allow a normal user to access this page but not the researcher
    if (req.session.researcher) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
    }

    //Fetch and return the task orders for the particular user for all that he/she is linked to.
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
                            return res.render('home', { username: user.username, taskorders: taskorders });
                        }




                    });



                }
            }
        });

});

module.exports = router;