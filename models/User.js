var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    admin: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: "User"
    },
    email: {
        type: String
    },
    gender: {
        type: Number,
        default: 0
    },
    phone: {
        type: String,
        index: true
    },
});

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        cb(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);