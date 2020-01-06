require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');
const { seedData } = require('../lib/utils/seedData.js');
const app = require('../lib/app.js');
const request = require('supertest');

describe('expenditure aggregation tests', () => {
  
  beforeAll(() => {
    connect();
  });

  beforeAll(() => {
    return mongoose.connection.dropDatabase();
  });

  let seedDictionary;
  beforeAll(async() => {
    return seedDictionary = await seedData();
  }, 60000);

  afterAll(() => {
    return mongoose.connection.close();
  });
  
  it('seed Data should return a dictionary object', () => {
    expect(seedDictionary.user1.toJSON()).toEqual({
      _id: expect.any(Object),
      email: 'Bobby@test1.test',
      __v: 0
    });
  });

  it('should return the highest expenditure of a month', async() => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'Bobby@test1.test', password: 'password' });
    await agent
      .get('/api/v1/expenditures/mostExpensive')
      .send({ budgetId: seedDictionary.user1Budget1._id.toString() })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          budgetId: seedDictionary.user1Budget1._id.toString(),
          item: 'groceries',
          cost: 40.33,
          dateOfExpenditure: '2020-01-03T00:00:00.000Z',
          __v: 0
        });
      });
  });

  it('should return the totals of expenditure items for a month', async() => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'Bobby@test1.test', password: 'password' });

    await agent
      .get('/api/v1/expenditures/itemTotals')
      .send({ budgetId: seedDictionary.user1Budget2._id.toString() })
      .then(res => {
        expect(res.body).toEqual({
          _id: 'pinball',
          total: 22
        });
      });
  });

  it('should return the total for expenditures for the month', async() => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/login')
      //note that the user is different
      .send({ email: 'Tom@test2.test', password: 'password' });

    await agent
      .get('/api/v1/expenditures/monthlyTotal')
      .send({ budgetId: seedDictionary.user2budget1._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: seedDictionary.user2budget1._id.toString(),
          total: 700.64
        });
      });
  });
});
