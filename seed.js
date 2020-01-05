require('dotenv').config();
require('./lib/utils/connect.js')();

const { seedData } = require('./lib/utils/seedData.js');
const mongoose = require('mongoose');

mongoose.connection.dropDatabase();
seedData()
  .then(() => console.log('Data seeded'))
  .finally(() => mongoose.connection.close());
