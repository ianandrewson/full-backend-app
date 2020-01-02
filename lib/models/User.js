const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'Email already in use']
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('User', schema);
