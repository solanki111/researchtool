var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var Experiment = require('../schema/experiment');
var TaskOrder = require('../schema/taskorder');


//Render the experiments page
var renderPage = function(req, res, next) {

    experimentData = {

        researcherID: req.session.userId,
        name: req.body.experimentname,
        studyID: req.params.studyid

    };

    Experiment.create(experimentData, function(error, study) {

        if (error) {
            return next(error);
        } else {

            return res.redirect('/studies/' + req.params.studyid);

        }
    });

};

/* add a new experiment to study page. */
router.post('/addexperiment/:studyid', function(req, res, next) {

    renderPage(req, res, next);

});



// Renaming the experiment
router.get('/rename/:studyid/:experimentid', function(req, res, next) {



    Experiment.findOne({ _id: req.params.experimentid })
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
                Experiment.findByIdAndUpdate({ _id: req.params.experimentid }, { name: req.query.experimentnewname }, { new: true }).exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });
});


//Deleting the experiment
router.get('/delete/:studyid/:experimentid', function(req, res, next) {


    Experiment.findOne({ _id: req.params.experimentid })
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
                Experiment.findOne({ _id: req.params.experimentid }).remove().exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });

});

//Adding task orders to the experiment
router.get('/taskorder/:studyid/:experimentid', function(req, res, next) {

    //Split email addresses by comma and remove blank spaces if any.
    var emails = req.query.emails.replace(/,\s*$/, "").split(',');
    emails = emails.map(Function.prototype.call, String.prototype.trim)


    var taskOrderData = {

        researcherID: req.session.userId,
        name: req.query.ordername,
        studyID: req.params.studyid,
        orders: req.query.task,
        ordernames: req.query.task_name,
        users: emails,
        experimentID: req.params.experimentid,
    };


    //Add the task order to the collections
    TaskOrder.create(taskOrderData, function(error, order) {

        if (error) {
            return next(error);
        } else {

            return res.redirect('/studies/' + req.params.studyid);

        }
    });



});


//Fetching task order in the experiments linked to a particular study
router.get('/fetchtaskorder/:studyid/:experimentid', function(req, res, next) {

    TaskOrder.find({
        researcherID: req.session.userId,
        experimentID: req.params.experimentid,
        studyID: req.params.studyid

    }).exec(function(errorFinding, taskorders) {

        if (errorFinding) {
            return next(errorFinding);
        } else {



            return res.send(taskorders);
        }


    })



});










module.exports = router;