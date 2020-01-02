const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  firstName: String,
  lastName: String
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

module.exports = mongoose.model('User', schema);
