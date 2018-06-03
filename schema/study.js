var mongoose = require('mongoose');

/*
"study" is the collection is the mongodb collections that stores
the following "_id" which is automatically created and is unique to the databse
Researchers unique (researcherID), name of the study (name), 
and the date (created)
*/



var StudySchema = new mongoose.Schema({

    researcherID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    created: {
        required: true,
        type: Date,
        default: Date.now
    },
    deleteable: {
        type: Boolean,
        default: true,
        required: true

    }
});


var Study = mongoose.model('Study', StudySchema);
// Exporting the model so that it could be used in other files without duplication
module.exports = Study;