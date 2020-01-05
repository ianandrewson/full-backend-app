const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  dateOfExpenditure: {
    type: Date,
    required: true
  }
}, {
  id: false
});

schema.statics.topExpenditures = function() {
  return this.aggregate([
    {
      '$group': {
        '_id': '$item',
        'count': { '$sum': 1 }
      }
    }, {
      '$sort': {
        'count': -1
      }
    }
  ]);
};

module.exports = mongoose.model('Expenditure', schema);
