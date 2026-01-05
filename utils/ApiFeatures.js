class ApiFeatures {
   constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
   }

   filter() {
      //1A. FILTERING
      console.log("hii from the filter");
      const queryObj = JSON.parse(JSON.stringify(this.queryString));
      const excludeFields = ['page', 'limit', 'fields', 'sort'];
      excludeFields.forEach(el => delete queryObj[el]);

      //1B. ADVANCED FILTERING
      //{duration : {$lte : 5}, difficulty : 'easy'}
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));

      return this;
   }

   sorting() {
      //2 SORTING
      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
         this.query = this.query.sort(sortBy);
      }

      return this;
   }
   fieldsLimiting() {
      //3 FIELDS LIMITINGS
      if (this.queryString.fields) {
         this.query = this.query.select(this.queryString.fields.split(',').join(' '));
         console.log("hii i am from the filed");
      }
      else {
         this.query = this.query.select('-__v');
      }

      return this;
   }

   pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      console.log("hii i am from the pagination");
      this.query = this.query.skip(skip).limit(limit);

      return this;
   }
}

module.exports = ApiFeatures;