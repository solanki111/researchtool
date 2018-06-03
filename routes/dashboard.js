var express = require('express');
var router = express.Router();
var User = require('../schema/user');

router.get('/', function(req, res, next) {

    //Only allow a normal user to access this page but not the researcher
    if (!req.session.researcher) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
    }

    //Find user and return his username to display on the webpage
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

                    res.render('dashboard', { username: user.username });

                }
            }
        });

});

module.exports = router;