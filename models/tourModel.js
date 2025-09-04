const { model } = require("mongoose");
const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = mongoose.Schema({
    name : {
        type: String,
        required : [true, 'A tour must have a name'],  //this is called Validator
        unique : true,
        // validate : [validator.isAlpha, "name should not contain number"] 
    },
    slug : {        
        type : String
    },
    duration : {
        type : Number,
        required : [true, 'A tour Must have a duration']
    },
    maxGroupSize : {
        type : Number,
        required : [true, 'A tour Must have a Group size']
    },
    difficulty : {
        type : String,
        required : [true, 'A tour Must have a difficulty']
    },
    ratingAverage : {
        type : Number,
        default : 4.5
    },
    ratingQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price']
    },
    priceDiscount : {
        type : Number,
        validate : {  //custom validator
            validator : function(val){
              return val < this.price;
            },
            message : "Discount price ({VALUE}) should be less thenregular price"
        }
    },
    summary : {
        type : String,
        trim : true , //remove the beg and end whitspaces
        required : [true, 'A tour must have a description']
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true, 'A tour must have a cover image']
    },
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    startDates : [Date],
    secretTour : {
    type : Boolean,
    default : false
   }
},
{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
}
);

tourSchema.virtual('durationInWeeks').get(function(){
    return this.duration/7;
})

//document Middleware : runs before .save() and .create()
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true});
  console.log("add the slug in DB");
  next();
});

tourSchema.pre('save', function(next){
    console.log('will save documents...');
    next();
})

tourSchema.post('save',function(doc,next){
    console.log(doc);
    next();
})

//Query middleware

tourSchema.pre(/^find/,function(next){  //  /^find/ => this includes all string start with find 
    this.find({secretTour : {$ne : true}})
    
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function(docs,next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    console.log(docs);
    next();
});

//Aggrergation Middleware
tourSchema.pre('aggregate',function(next){   // here in this we remove the super secret key (secretTour : true) from the aggregation (TourStats)
   console.log(this.pipeline());
   this.pipeline().unshift({$match : {secretTour : {$ne : true}}})

   next();
})



const Tour = mongoose.model('Tour', tourSchema);  //create the collection of name tour

// const testTour = new Tour({
//     name : 'the snow adventure',
//     rating : 4.5,
//     price : 200
// })

// testTour.save()
// .then(doc => console.log(doc))
// .catch(err => console.log(err));

module.exports = Tour;