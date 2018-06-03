var mongoose = require('mongoose');

/*
"tasksorder" is the collection is the mongodb collections that stores
the following "_id" which is automatically created and is unique to the databse
Researchers unique (researcherID), 
name of the task order (name), 
task instructions (instructions),
Unique ID of the study (studyID),
and the date (created),
the email ID's of the the users that are unique (users[]),
orders and their names of tasks
*/
var TaskOrderSchema = new mongoose.Schema({

    researcherID: {
        type: String,
        required: true
    },
    experimentID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    studyID: {
        type: String,
        required: true
    },
    created: {
        required: true,
        type: Date,
        default: Date.now
    },
    orders: {
        type: Array,
        default: []
    },
    ordernames: {
        type: Array,
        default: []
    },
    users: {
        type: Array,
        default: []
    }
});


var TaskOrder = mongoose.model('TaskOrder', TaskOrderSchema);
module.exports = TaskOrder;