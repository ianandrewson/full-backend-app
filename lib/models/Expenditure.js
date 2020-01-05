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

schema.statics.mostExpensive = function(budgetId) {
  return this.aggregate([
    {
      '$match': {
        'budgetId': budgetId
      }
    }, {
      '$sort': {
        'cost': -1
      }
    }, {
      '$limit': 1
    }
  ]);
};

schema.statics.itemTotals = function(budgetId) {
  return this.aggregate([
    { '$match': { 'budgetId': budgetId } }, 
    {
      '$group': {
        '_id': '$item', 
        'total': {
          '$sum': '$cost'
        }
      }
    }, 
    { '$sort': { 'total': -1 } }
  ]);
};

schema.statics.monthlyTotal = function(budgetId) {
  return this.aggregate([
    {
      '$match': {
        'budgetId': budgetId
      }
    }, {
      '$group': {
        '_id': '$budgetId', 
        'total': {
          '$sum': '$cost'
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Expenditure', schema);
