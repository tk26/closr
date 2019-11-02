var mongoose = require('mongoose');
var config = require('../services/config');

const connectDb = () => {
  return mongoose.connect(config.mongoUri);
};

module.exports = connectDb;