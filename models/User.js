const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = Schema({
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
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);