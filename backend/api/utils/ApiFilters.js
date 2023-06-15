const logger = require("./logger");

class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing fields from the query
    const removeFields = ['sort', 'page', 'limit', 'fields', 'q'];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    // replace gte, gt, lte, lt with $gte, $gt, $lte, $lt (mongoDB operators)
    // gte = greater than or equal
    // use regex to add $ sign before gte, gt, lte, lt
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    logger.info(`APIFilters.filter() - query: ${this.query}`);
    return this;
  }

  sort() {
    // Sorting
    // sort=price,ratingsAverage
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      logger.info(`APIFilters.sort() - sortBy: ${sortBy}`);
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      // default sort by postingDate in descending order (newest first)
      this.query = this.query.sort('-postingDate');
    }

    logger.info(`APIFilters.sort() - query: ${this.query}`);
    return this;
  }

  limitFields() {
    // Field Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields); // select('name price')
    } else {
      this.query = this.query.select('-__v');
    }

    logger.info(`APIFilters.limitFields() - query: ${this.query}`);
    return this;
  }

  paginate() {
    // Pagination
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skipResults = (page - 1) * limit;
    this.query = this.query.skip(skipResults).limit(limit);
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    logger.info(`APIFilters.paginate() - query: ${this.query}`);
    return this;
  }

  searchByQuery() {
    // Search by query
    if (this.queryStr.q) {
      const queryStr = this.queryStr.q.split('-').join(' ');
      this.query = this.query.find({ $text: { $search: `"${queryStr}"` } });
    }

    logger.info(`APIFilters.searchByQuery() - query: ${this.query}`);
    return this;
  }
}

module.exports = APIFilters;