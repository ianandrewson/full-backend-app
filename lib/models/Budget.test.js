require('dotenv').config();
const connect = require('../utils/connect.js');
const mongoose = require('mongoose');
const Budget = require('../models/Budget.js');
const User = require('../models/User.js');

describe('budget model tests', () => {
  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'test@test.test',
      password: 'password'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should have a required userId field', () => {
    const budget = new Budget();
    const { errors } = budget.validateSync();
    expect(errors.userId.message).toEqual('Path `userId` is required.');
  });

  it('should have a required monthOf field', () => {
    const budget = new Budget();
    const { errors } = budget.validateSync();
    expect(errors.monthOf.message).toEqual('Path `monthOf` is required.');
  });

  it('should have a required budget', () => {
    const budget = new Budget();
    const { errors } = budget.validateSync();
    expect(errors.budget.message).toEqual('Path `budget` is required.');
  });
  
  it('should be able to create a new budget for the month', async() => {
    const budget = await Budget.create({
      userId: user._id,
      monthOf: '1/2020',
      budget: 1000
    });
    expect(budget.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: user._id,
      monthOf: '1/2020',
      budget: 1000,
      __v: 0
    });
  });
  
  it('should have a virtual Expenditures field', async() => {
    const budget = await Budget.create({
      userId: user._id,
      monthOf: '1/2020',
      budget: 1000
    });
    budget.expenditures = [];
    expect(budget.expenditures).toBeDefined();
    expect(budget.expenditures).toEqual([]);
  });
});
