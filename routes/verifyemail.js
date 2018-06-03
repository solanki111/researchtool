var express = require('express');
var router = express.Router();
var User = require('../schema/user');

// Verify the user by his userID when the call to this URL is made.
router.get('/:uid', function(req, res, next) {

    User.findByIdAndUpdate(req.params.uid, { emailVerified: true }, { new: true },
        function(err, response) {

            if (err) {
                return res.status(500).send(err);
            } else {
                return res.redirect('/');
            }
        });



});

module.exports = router;