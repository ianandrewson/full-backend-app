const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthOf: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
}, {
  id: false,
  toJSON: {
    virtuals: true
  }
});

schema.virtual('expenditures', {
  ref: 'Expenditures',
  localField: '_id',
  foreignField: 'budgetId'
});

module.exports = mongoose.model('Budget', schema);
