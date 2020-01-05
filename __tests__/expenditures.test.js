require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');
const Budget = require('../lib/models/Budget.js');
const Expenditure = require('../lib/models/Expenditure.js');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');

describe('expenditure route tests', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let agent;
  let user;
  let budget;
  beforeEach(async() => {
    agent = request.agent(app);

    user = await User.create({
      email: 'test@test.test',
      password: 'password'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.test', password: 'password' });

    budget = await Budget.create({
      userId: user.id,
      monthOf: '1/2020',
      budget: 1000
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to post a new expenditure', async() => {
    await agent
      .post('/api/v1/expenditures')
      .send({
        budgetId: budget._id,
        item: 'groceries',
        cost: 43.22,
        dateOfExpenditure: new Date('1/4/2020 14:30')
      })
      .then(res => {
        console.log(typeof budget, budget);
        expect(res.body).toEqual({
          _id: expect.any(String),
          budgetId: budget._id.toString(),
          item: 'groceries',
          cost: 43.22,
          dateOfExpenditure: '2020-01-04T22:30:00.000Z',
          __v: 0
        });
      });
  });
});
