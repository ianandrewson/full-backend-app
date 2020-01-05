const { Router } = require('express');
const Expenditure = require('../models/Expenditure.js');
const ensureAuth = require('../middleware/ensureAuth.js');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Expenditure
      .create(req.body)
      .then(expenditure => res.send(expenditure))
      .catch(next);
  });