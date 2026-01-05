const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { types } = require('util');
const crypto = require('crypto');
const { type } = require('os');
const { validate } = require('./tourModel');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "provide a right email"]
    },
    photo: {
        type : String,
        default : 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Provide a Password"],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'confirm your password'],
        validate: {  //this only work on create and save (not in case update the pass)
            validator: function (el) {
                return el === this.password;
            },
            message: "Password are not same"
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpires: String,
    active: {
        type: Boolean,
        default: true,
        select: false  //not show (only show in DB)
    }
});

userSchema.pre('save', async function (next) {
    //only run this function when password is actually modified
    if (!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //delete passwordconfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; //here 1 sec is substract from this to ensure that new token is generated after the pass changed
    next();
})

userSchema.pre(/^find/, function (next) {
    //this is point to the current query
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changeTimeStamp, JWTTimestamp);
        return JWTTimestamp < changeTimeStamp;  //here jwtTimestamp => when the initial jwt token create and changeTimeStamp -> when we update the jwt token 
        //true menas the password is change
    }
    //password not change
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); //this encrypted token is stored in DB (not directly reset token is stored(bad practice))

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
}


const User = mongoose.model("User", userSchema);
module.exports = User;