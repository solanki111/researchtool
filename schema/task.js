var mongoose = require('mongoose');

/*
"tasks" is the collection is the mongodb collections that stores
the following "_id" which is automatically created and is unique to the databse
Researchers unique (researcherID), 
name of the task (name), 
task instructions (instructions),
link to the site to be visited (link),
Unique ID of the study (studyID),
and the date (created)
*/

var TaskSchema = new mongoose.Schema({

    researcherID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },

    link: {
        type: String,
        required: true,
    },

    logo: {
        type: String,
        required: false
    },
    created: {
        required: true,
        type: Date,
        default: Date.now
    },
    disabled: {

        required: true,
        type: Boolean,
        default: false
    },
    studyID: {
        type: String,
        required: true
    }

});


var Task = mongoose.model('Task', TaskSchema);
// Exporting the model so that it could be used in other files without duplication
module.exports = Task;