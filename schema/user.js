var mongoose = require('mongoose');

// Bcrypt module is for hashing the passwords
var bcrypt = require('bcrypt');


/*

The 'users' collection in the mongodb has the details of registered users.

It consists of automatically generated '_id',
email of the user that has the unique property and cannot have duplicate entries,
username is the fullname of the user that is registered during the signup,
password field is the one that contains the hashed password
apart from the above fields, age and gender are the user properties and
researcher is to track weather the user of the website is normal user
or a researcher
*/

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true

    },
    gender: {
        type: String,
        required: true
    },

    researcher: {
        type: Boolean,
        required: true,
        default: false
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false

    }
});



//authenticate input against database
/**
 * 
 * @param {*} email : email address of the user logging in
 * @param {*} password : password of the user logging in
 * @param {*} callback : callback function
 */
UserSchema.statics.authenticate = function(email, password, callback) {


    User.findOne({ email: email })
        .exec(function(err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }

            /**
             * Hashing the password, and compare with with the password user
             * is trying to login to.
             */
            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });


}



//hashing a password before saving it to the database
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;