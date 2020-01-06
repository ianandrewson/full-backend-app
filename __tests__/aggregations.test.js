require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');
const { seedData } = require('../lib/utils/seedData.js');
// const app = require('../lib/app.js');
// const request = require('supertest');

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
  
  it('seed Data should return a dictionary', () => {
    expect(seedDictionary.user1.toJSON()).toEqual({
      _id: expect.any(Object),
      email: 'Bobby@test1.test',
      __v: 0
    });
  });
});
