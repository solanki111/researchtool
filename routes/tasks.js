var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var Task = require('../schema/task');


var renderPage = function(req, res, next) {

    taskData = {

        researcherID: req.session.userId,
        name: req.body.taskname,
        instructions: req.body.cktext,
        link: req.body.tasklink,
        studyID: req.params.studyid

    };

    Task.create(taskData, function(error, study) {

        if (error) {
            return next(error);
        } else {

            return res.redirect('/studies/' + req.params.studyid);

        }
    });

};

/* GET home page. */
router.post('/addtask/:studyid', function(req, res, next) {

    renderPage(req, res, next);

});


router.get('/rename/:studyid/:taskid', function(req, res, next) {

    //Rename it here

    Task.findOne({ _id: req.params.taskid })
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
                Task.findByIdAndUpdate({ _id: req.params.taskid }, { name: req.query.tasknewname }, { new: true }).exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });
});

router.get('/editlink/:studyid/:taskid', function(req, res, next) {

    //Rename it here

    Task.findOne({ _id: req.params.taskid })
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
                Task.findByIdAndUpdate({ _id: req.params.taskid }, { link: req.query.newlink }, { new: true }).exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });
});


router.get('/editinstructions/:studyid/:taskid', function(req, res, next) {

    //Rename it here

    Task.findOne({ _id: req.params.taskid })
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
                Task.findByIdAndUpdate({ _id: req.params.taskid }, { instructions: req.query.newinstructions }, { new: true }).exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });
});


router.get('/delete/:studyid/:taskid', function(req, res, next) {


    Task.findOne({ _id: req.params.taskid })
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
                Task.findOne({ _id: req.params.taskid }).remove().exec();
                return res.redirect('/studies/' + req.params.studyid);

            }


        });

});










module.exports = router;