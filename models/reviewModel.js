const mongoose = require('mongoose');
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "review cannot be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, "review must belong to the tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "review must belong to the user"]
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

//here bug in the index part that it not avoid the duplicates review
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });  //this is compound index it says : “The combination of tour and user must be unique across the collection.” so one user is give only one review per tour

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (!doc) return;

    await doc.constructor.calcAverageRatings(doc.tour);
})

reviewSchema.post('save', function () {  //not use next in post method
    this.constructor.calcAverageRatings(this.tour);  //so when we add new review then it is update number of rating and rating avg per tour
    //here this is not use because it point the current document but using this.constructor represent that we can access complete model
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;