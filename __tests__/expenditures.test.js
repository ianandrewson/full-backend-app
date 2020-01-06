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

  it('should be able to get all of a budget\'s expenditures', async() => {
    const expenditures = await Expenditure.create([
      { budgetId: budget._id, item: 'groceries', cost: 43.22, dateOfExpenditure: new Date('1/4/2020 14:30') },
      { budgetId: budget._id, item: 'haircut', cost: 30.00, dateOfExpenditure: new Date('1/4/2020 14:30') },
      { budgetId: budget._id, item: 'beers', cost: 12.00, dateOfExpenditure: new Date('1/4/2020 14:30') },
    ]);

    await agent
      .get('/api/v1/expenditures')
      .send({ budgetId: budget._id })
      .then(res => {
        expenditures.forEach(expenditure => {
          expect(res.body).toContainEqual({
            _id: expenditure._id.toString(),
            budgetId: budget._id.toString(),
            item: expenditure.item,
            cost: expenditure.cost,
            dateOfExpenditure: '2020-01-04T22:30:00.000Z',
            __v: 0
          });
        });
      });
  });

  it('should be able to get an expenditure by id', async() => {
    const expenditure = await Expenditure.create({
      budgetId: budget._id,
      item: 'groceries',
      cost: 43.22,
      dateOfExpenditure: new Date('1/4/2020 14:30')
    });
    await agent
      .get(`/api/v1/expenditures/${expenditure._id}`)
      .then(res => {
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
  
  it('should be able to update an expenditure by id', async() => {
    const expenditure = await Expenditure.create({
      budgetId: budget._id,
      item: 'groceries',
      cost: 43.22,
      dateOfExpenditure: new Date('1/4/2020 14:30')
    });
    await agent
      .patch(`/api/v1/expenditures/${expenditure._id}`)
      .send({ item: 'bowling', cost: 20.22 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expenditure._id.toString(),
          budgetId: budget._id.toString(),
          item: 'bowling',
          cost: 20.22,
          dateOfExpenditure: '2020-01-04T22:30:00.000Z',
          __v: 0
        });
      });
  });

  it('should be able to delete an expenditure by ID', async() => {
    const expenditure = await Expenditure.create({
      budgetId: budget._id,
      item: 'groceries',
      cost: 43.22,
      dateOfExpenditure: new Date('1/4/2020 14:30')
    });
    await agent
      .delete(`/api/v1/expenditures/${expenditure._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expenditure._id.toString(),
          budgetId: budget._id.toString(),
          item: 'groceries',
          cost: 43.22,
          dateOfExpenditure: '2020-01-04T22:30:00.000Z',
          __v: 0
        });
      });
  });
});
