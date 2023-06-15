const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  // Check mongoose object id validity
  // https://mongoosejs.com/docs/api.html#types-objectid-js
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = isValidObjectId;