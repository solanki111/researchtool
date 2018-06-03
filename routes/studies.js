var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var Study = require('../schema/study');
var Task = require('../schema/task');
var Experiment = require('../schema/experiment');
var TaskOrder = require('../schema/taskorder');

/* GET home page. */
router.get('/:id', function(req, res, next) {


    return renderStudyPage(req, res, next);

});


//Render the Study page
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

                    Study.findOne({
                        researcherID: req.session.userId,
                        _id: req.params.id
                    }).sort({ _id: -1 }).exec(function(studyError, studies) {

                        if (studyError) {

                            var err = new Error('Something went wrong.');
                            err.status = 400;
                            return next(err);

                        } else {

                            //Get tasks related to that experiment

                            Task.find({
                                researcherID: req.session.userId,
                                studyID: req.params.id
                            }).sort({ _id: -1 }).exec(function(taskError, tasks) {

                                if (taskError) {

                                    var err = new Error('Something went wrong.');
                                    err.status = 400;
                                    return next(err);

                                } else {


                                    Experiment.find({
                                        researcherID: req.session.userId,
                                        studyID: req.params.id
                                    }).exec(function(expError, experiments) {

                                        if (expError) {
                                            var err = new Error('Something went wrong.');
                                            err.status = 400;
                                            return next(err);

                                        } else {

                                            return res.render('studyboard', { username: user.username, studyname: studies.name, studyid: studies._id, tasks: tasks, experiments: experiments });




                                        }

                                    });






                                }

                            });





                        }

                    });



                }
            }
        });


};



module.exports = router;