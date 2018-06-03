var express = require('express');
var router = express.Router();
var User = require('../schema/user');
var Task = require('../schema/task');
var TaskOrder = require('../schema/taskorder');
var async = require('async');

/* GET home page. */
router.get('/:id', function(req, res, next) {

    if (req.session.researcher) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
    }

    //Find all the tasks related to that user, study and experimet
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

                    TaskOrder.findOne({ _id: req.params.id }).exec(function(err, order) {

                        if (err) {
                            return next(err);
                        } else {




                            //Sorting the tasks in the proper order
                            Task.find({ _id: { "$in": order.orders } }).exec(function(e, tasks) {

                                if (e) {
                                    return next(err);
                                } else {

                                    function findObjectByKey(array, value) {

                                        for (var i = 0; i < array.length; i++) {



                                            if (array[i]['_id'] == value) {


                                                return array[i];
                                            }
                                        }

                                    }



                                    var sort = [];


                                    order.orders.forEach(function(taskid) {

                                        sort.push(findObjectByKey(tasks, taskid));

                                    });

                                    return res.render('usertasks', { username: user.username, tasks: sort });

                                }
                            });
                        }

                    });








                }
            }
        });

});

module.exports = router;