const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  id: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    },
    virtuals: true
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

schema.statics.authorize = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    const err = new Error('Invalid email or password. Please try again.');
    err.status = 401;
    throw err;
  }
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('Invalid email or password. Please try again.');
    err.status = 401;
    throw err;
  }
};

schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '12h'
  });
};

schema.virtual('budgets', {
  ref: 'Budget',
  localField: '_id',
  foreignField: 'userId'
});

module.exports = mongoose.model('User', schema);
