 class APIFeatures{
   constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
   }
   
   filter(){
   //1A. Filtering
   const queryObj = {...this.queryString};
   const excludeFields = ['page','sort','limit','fields'];
   excludeFields.forEach(el => delete queryObj[el]);

   console.log(this.queryString, queryObj);

   //1B. Advanced Filetering
  
   // {difficulty : "easy" , duration : {$gte : 8}}  // original query
   // {difficulty : "easy", duration : {gte : 8}} //occur this

   let queryStr = JSON.stringify(queryObj);
   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
   console.log(JSON.parse(queryStr));

   
  this.query.find(JSON.parse(queryStr));

  return this;
   }

   Sort(){
  //2 Sorting
  console.log(this.queryString.sort);
  if(this.queryString.sort){
    const sortBy = (this.queryString.sort).split(',').join(' ');
    this.query = this.query.sort(sortBy);
   //  sort(price ratingsAverage)
  }
  else{
   this.query = this.query.sort('-ratingQuantity');  //by default  
  } 
  return this;
}
 limitFields(){
  //3. limiting fields
  console.log(this.queryString.fields);
  if(this.queryString.fields){
   const fields = this.queryString.fields.split(',').join(' ');
   this.query = this.query.select(fields);
  }
  else{
    this.query = this.query.select('-__v');
  }

  return this;
 }

 Paging(){
  //4. Pagination
  const page = this.queryString.page*1;
  const limit = this.queryString.limit*1 || 100
  const skip = (page-1)*limit;

this.query = this.query.skip(skip).limit(limit);
  console.log(this.queryString.page);

  
 return this;
 }
}

module.exports = APIFeatures;