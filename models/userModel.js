
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please tell us your name"],
    },
    email : {
        type : String,
        required : [true, "Please provide your email"],
        unique : true,
        lowerCase : true,
        validator : [validator.isEmail, "provide a right email"]
    },
    photo : String,
    role : {
        type : String,
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : "user"
    },
    password : {
       type : String,
       required : [true, "Provide a Password"],
       minLength : 8,
       select : false
    },
    passwordConfirm : {
       type : String,
       required : [true,'confirm your password'],
       validate : {
        validator : function(el){
            return el === this.password;
        },
        message : "Password are not same"
       }
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
    active : {
        type : Boolean,
        default : true,
        select : false
    }
}); 

userSchema.pre('save', async function(next){
    //only run this function when password is actually modified
    if(!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    //delete passwordconfirm field
    this.passwordConfirm = undefined;   
    next();
})

userSchema.pre(/^find/, function(next){
    //this point the current query
   this.find({active : {$ne : false}})

   next();
})

// 🔹 Mongoose middleware: runs before saving a User document
userSchema.pre('save', function(next) {
  // 1) If password was NOT modified OR this is a new user, skip
  if (!this.isModified('password') || this.isNew) return next();

  // 2) Otherwise, update the "passwordChangedAt" timestamp
  //    Subtract 1 second so the token issued just before saving is still valid
  this.passwordChangedAt = Date.now() - 1000;

  // 3) Continue with save()
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp){
   if(this.passwordChangedAt){
    console.log(this.passwordChangedAt, JWTTimestamp);
      const changeTimeStamp = this.passwordChangedAt.getTime()/1000;
      return JWTTimestamp < changeTimeStamp; 
   }

   return false;
}
// 🔹 Instance method to create a password reset token
userSchema.methods.createPasswordResetToken = function(){
    // 1) Generate a random reset token (plain text)
    const resetToken = crypto.randomBytes(32).toString('hex');
    // 2) Hash the reset token and store it in the database (for security)
    //why security? => If you stored plain token in the database
    //Imagine your DB gets leaked (SQL injection, insider threat, server misconfig, etc.).
    //The hacker sees actual reset key so it doesn’t need to guess anything → they can immediately visit:
    // https://yourapp.com/resetPassword/4f3b1c2d5e6a7b8c9d0e112233445566...
    // Boom 💥 they reset your user’s password.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // Debugging: show plain token vs hashed token in console
    console.log(resetToken, this.passwordResetToken);
// 3) Set expiration time for the reset token (10 minutes)
    this.passwordResetExpires = Date.now() + 10*60*1000;
// 4) Return plain reset token (to send via email)
    return resetToken;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
