const mongoose = require('mongoose');

const bookingSchema = mongoose.bookingSchema({
    tour : {
      type : mongoose.Schema.ObjectId,
      ref : 'Tour',
      required : [true, 'Booking must belings to a tour!']
    },
    user : {
      type : mongoose.Schema.ObjectId,
      ref : 'User',
      required : [true, 'Booking must belings to a User!']
    },
    price : {
      type : Number,
      required : [true, 'Booking must have a price']
    },
    createdAt : {
      type : Date,
      default : Date.now()
    },
    paid : {
      type : Boolean,
      default : true
    }
})

bookingSchema.pre(/^find/, function(next){
    this.populate('user').populate({
        path : 'tour',
        select : 'name'
    });
    next();
});

const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;