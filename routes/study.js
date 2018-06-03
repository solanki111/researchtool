var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var Study = require('../schema/study');
var Task = require('../schema/task');

//Render page when it is first requested for
router.get('/', function(req, res, next) {

    return renderStudyPage(req, res, next);

});


//Creating a new study
router.post('/', function(req, res, next) {



    studyData = {
        researcherID: req.session.userId,
        name: req.body.study
    };

    Study.create(studyData, function(error, study) {

        if (error) {
            return next(error);
        } else {

            return renderStudyPage(req, res, next);

        }

    });

});


// renaming the study
router.get('/rename/:uid', function(req, res, next) {



    Study.findOne({ _id: req.params.uid })
        .exec(function(err, result) {

            if (err) {

                var err = new Error('Something went wrong.');
                err.status = 400;
                return next(err);

            } else if (!(result.researcherID == req.session.userId)) {
                var err = new Error('You do not have permissions to make this action.');
                err.status = 400;
                return next(err);
            } else {

                //Rename this document
                Study.findByIdAndUpdate({ _id: req.params.uid }, { name: req.query.studynewname }, { new: true }).exec();
                return res.redirect('/study');

            }


        });


});


//Deleting the study
router.get('/delete/:studyid', function(req, res, next) {


    Study.findOne({ _id: req.params.studyid })
        .exec(function(err, result) {



            if (err) {

                var err = new Error('Something went wrong.');
                err.status = 400;
                return next(err);

            } else if (!(result.researcherID == req.session.userId)) {
                var err = new Error('You do not have permissions to make this action.');
                err.status = 400;
                return next(err);
            } else {

                //Delete the document
                Study.findOne({ _id: req.params.studyid }).remove().exec();
                return res.redirect('/study');

            }


        });

});

//Function to render the page
var renderStudyPage = function(req, res, next) {

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

                    Study.find({
                        researcherID: req.session.userId
                    }).sort({ _id: -1 }).exec(function(studyError, studies) {

                        if (studyError) {

                            var err = new Error('Something went wrong.');
                            err.status = 400;
                            return next(err);

                        } else {


                            return res.render('study', { username: user.username, studies: studies, studiesCount: studies.length });
                        }

                    });



                }
            }
        });


};



module.exports = router;