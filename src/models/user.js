const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { stringify } = require('querystring');
require('dotenv').config({ path: './.env' });

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    full_name: {
        type: String
    },
    npm: {
        type: String,
        required: true
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    client_id: {
        type: String
    },
    expires_in: {
        type: Date
    }
});

UserSchema.methods.generateAccessToken = function(scope) {
    var user = this;
    var token = crypto.randomBytes(20).toString('hex');
    user.expires_in = Date.now() + 5*60*1000
    user.access_token = token;
    return user.save().then(function() {
        return token;
    });
};

UserSchema.methods.generateRefreshToken = function(scope) {
    var user = this;
    var token = crypto.randomBytes(20).toString('hex');
    user.refresh_token = token;
    return user.save().then(function() {
        return token;
    });
};

UserSchema.statics.findByToken = async function(token) {
    var User = this;
    const user = await User.findOne({
        'access_token': token
    });
    return {
        user
    }
};

UserSchema.statics.findByCredentials = function(username, password) {
    var User = this;
    return User.findOne({ username }).then(function(user) {
        if (!user) {
            return Promise.reject({ code: 400, message: "Invalid Credentials" });
        }
        return new Promise(function(resolve, reject) {
            if (password == user.password){
                resolve(user)
            } else {
                reject()
            }
        });
    });
};

UserSchema.pre('save', function(next) {
    var user = this;
    next();
});

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.updateOne({
        $pull: {
            tokens: { token }
        }
    });
};


module.exports = mongoose.model('User', UserSchema);