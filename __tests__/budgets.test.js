require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const User = require('../lib/models/User.js');
const Budget = require('../lib/models/Budget.js');
const app = require('../lib/app.js');

describe('budget route tests', () => {
  beforeAll(() => {
    connect();
  });

  let user;
  let agent;
  beforeEach(async() => {
    user = await User.create({
      email: 'test@test.test',
      password: 'password'
    });

    agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.test', password: 'password' });
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to post a new budget', async() => {
    await agent
      .post('/api/v1/budgets')
      .send({
        userId: user.id,
        monthOf: '1/2020',
        budget: 1000,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user.id,
          monthOf: '1/2020',
          budget: 1000,
          __v: 0
        });
      });
  });

  it('should to be able to get all budgets for a user', async() => {
    const budgets = await Budget.create([
      { userId: user.id, monthOf: '1/2020', budget: 1000 },
      { userId: user.id, monthOf: '2/2020', budget: 1050 },
      { userId: user.id, monthOf: '3/2020', budget: 950 }
    ]);
    await agent
      .get('/api/v1/budgets')
      .then(res => {
        budgets.forEach(budget => {
          expect(res.body).toContainEqual({
            _id: budget.id,
            userId: user.id,
            monthOf: budget.monthOf,
            budget: budget.budget,
            __v: 0
          });
        });
      });
  });

  it('should be able to get a budget by ID', async() => {
    const budget = await Budget.create({
      userId: user.id,
      monthOf: '1/2020',
      budget: 1000,
    });
    await agent
      .get(`/api/v1/budets/${budget.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user.id,
          monthOf: '1/2020',
          budget: 1000,
          __v: 0
        });
      });
  });

  it('should be able to update a budget', async() => {
    await Budget.create({
      userId: user.id,
      monthOf: '1/2020',
      budget: 1000
    });
    await agent
      .patch('/api/v1/budgets')
      .send({ budget: 2000 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user.id,
          monthOf: '1/2020',
          budget: 2000,
          __v: 0
        });
      });
  });

  it('should be able to delete a budget', async() => {
    const budget = await Budget.create({
      userId: user.id,
      monthOf: '1/2020',
      budget: 1000
    });
    await agent
      .delete(`/api/v1/budgets/${budget.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: user.id,
          monthOf: '1/2020',
          budget: 1000,
          __v: 0
        });
      });
  });
});
