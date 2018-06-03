/*
"experiment" is the collection is the mongodb collections that stores
the following "_id" which is automatically created and is unique to the databse
Researchers unique (researcherID), name of the experiment (name), 
Unique ID of the study (studyID),
and the date (created)
*/

var mongoose = require('mongoose');

var ExperimentSchema = new mongoose.Schema({

    researcherID: {
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
    }
});


var Experiment = mongoose.model('Experiment', ExperimentSchema);

// Exporting the model so that it could be used in other files without duplication
module.exports = Experiment;