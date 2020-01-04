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
