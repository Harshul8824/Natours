const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true,
    trim: true,
    maxLength: [40, "a tour name must have less then or equal to 40 charater"],
    minLength: [10, "a tour name must have greater then or equal to 10 charater"]
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'a tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have a maxGroupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: "difficulty is either : 'easy', 'medium', 'difficult'"
    }
  },
  ratingsAverage: {
    type: Number,
    default: 3,
    min: [1, "rating must be greater then 1"],
    max: [6, "rating must be lesser then 6"]
  },
  ratingsQuantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'a tour must have a summary'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'a tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }
  ],
  startLocation: {
    //Geolocation JSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: [Number],
    description: String,
    address: String
  },
  locations: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ]
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })

  //this is for indexing  
tourSchema.index({duration : -1})
tourSchema.index({price : 1})
tourSchema.index({startLocation : '2dsphere'});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})

//VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE  runs before .save() and .create only not in findByIdandUpdate or insertInMany etc
tourSchema.pre('save', function (next) {   //called pre save hooks or pre save middleware
  this.slug = slugify(this.name, { lower: true });

  next();
})

// tourSchema.pre('save', function (next) {  //this point to the document body
//   console.log("will save documents.....");

//   next();
// })

//for modelling tour guide : embedding (not good practice instead we use : child referencing)
// tourSchema.pre('save', async function(next){
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//   next();
// })

// tourSchema.post('save', function (doc, next) {  //called post save hooks or post save middleware
//   console.log(doc);

//   next();
// })

//TO POPULATE THE OBJECTID
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })

  next();
})

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) { //  /^find/ take all function start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();    //this point to the query body

  next();
})

// tourSchema.post('find', function (doc, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   // console.log(doc);

//   next();
// })

//AGGREGATE MIDDLEWARE  //this point to the aggregate validators body
// tourSchema.pre('aggregate', function (next) {  //using this we add one more aggregate operater add so that we remove the secret key documnent
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });  //add the property in beginning of aggregate array
//   console.log(this.pipeline());
//   next();
// })



const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//     name: "the mount everest",
//     rating: 5,
//     price: 500000
// })

// testTour.save().then(doc => console.log(doc)).catch(err => console.log("err 💥:", err));

module.exports = Tour;