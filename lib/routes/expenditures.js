const { Router } = require('express');
const Expenditure = require('../models/Expenditure.js');
const ensureAuth = require('../middleware/ensureAuth.js');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Expenditure
      .create(req.body)
      .then(expenditure => res.send(expenditure))
      .catch(next);
  })

  .get('/mostExpensive', ensureAuth, (req, res, next) => {
    console.log('req.query: ', req.query);
    console.log('req.body: ', req.body);
    const { budgetId } = req.query;
    Expenditure
      .mostExpensive(budgetId)
      .then(expensiveExpenditure => res.send(expensiveExpenditure))
      .catch(next);
  })

  .get('/itemTotals', ensureAuth, (req, res, next) => {
    const { budgetId } = req.query;
    Expenditure
      .itemTotals(budgetId)
      .then(totals => res.send(totals))
      .catch(next);
  })

  .get('/monthlyTotal', ensureAuth, (req, res, next) => {
    const { budgetId } = req.query;
    Expenditure
      .monthlyTotal(budgetId)
      .then(totalForMonth => res.send(totalForMonth))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Expenditure
      .findById(req.params.id)
      .then(expenditure => res.send(expenditure))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Expenditure
      .find({ budgetId: req.body.budgetId })
      .then(expenditures => res.send(expenditures))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Expenditure
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(expenditure => res.send(expenditure))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Expenditure
      .findByIdAndDelete(req.params.id)
      .then(expenditure => res.send(expenditure))
      .catch(next);
  });
