"use strict";

require("rootpath")();

const mongoose = require('mongoose');
const winston = require("winston");

module.exports = (settings, server) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(settings.database.mongodb.uri, settings.database.mongodb.options);
  mongoose.connection.on('error', (err) => {
    winston.info('MongoDB Connection Error. Please make sure that MongoDB is running.');    
  })
  mongoose.connection.on('open', () => {
    winston.info('MongoDB Connection Success.');
  })
};