const mongoose = require('mongoose');
const dburl = require('../secret.js').dburl;

const promise = mongoose.connect(dburl, {
  useMongoClient: false,
});

promise.then(function(err) {
  if (err) console.log(err);
  else console.log('Successfully connected to database');
});
