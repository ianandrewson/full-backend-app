const { Router } = require('express');
const Budget = require('../models/Budget.js');
const ensureAuth = require('../middleware/ensureAuth.js');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Budget
      .create(req.body)
      .then(budget => res.send(budget))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Budget
      .findById(req.params.id)
      .then(budget => res.send(budget))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Budget
      .find({ userId: req.user._id })
      .then(budgets => {
        res.send(budgets);
      })
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Budget
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(budget => res.send(budget))
      .catch(next);
  });

