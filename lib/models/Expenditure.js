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

module.exports = mongoose.model('Expenditure', schema);
