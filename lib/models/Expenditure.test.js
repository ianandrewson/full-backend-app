require('dotenv').config();
const connect = require('../utils/connect.js');
const mongoose = require('mongoose');
const Expenditure = require('../models/Expenditure.js');
const Budget = require('../models/Budget.js');
const User = require('../models/User.js');

describe('expenditure model test', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let budget;
  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'test@test.test',
      password: 'password'
    });

    budget = await Budget.create({
      userId: user._id,
      monthOf: '1/2020',
      budget: 1000
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should have a required item', () => {
    const expenditure = new Expenditure();
    const { errors } = expenditure.validateSync();
    expect(errors.item.message).toEqual('Path `item` is required.');
  });

  it('should have a required cost', () => {
    const expenditure = new Expenditure();
    const { errors } = expenditure.validateSync();
    expect(errors.cost.message).toEqual('Path `cost` is required.');
  });

  it('should have a required dateOfExpenditure field', () => {
    const expenditure = new Expenditure();
    const { errors } = expenditure.validateSync();
    expect(errors.dateOfExpenditure.message).toEqual('Path `dateOfExpenditure` is required.');
  });

  it('should have a required budgetId field', () => {
    const expenditure = new Expenditure();
    const { errors } = expenditure.validateSync();
    expect(errors.budgetId.message).toEqual('Path `budgetId` is required.');
  });

  it('should be able to create a new expenditure', async() => {
    const expenditure = await Expenditure.create({
      budgetId: budget._id,
      item: 'groceries',
      cost: 64.42,
      dateOfExpenditure: new Date(),
    });
    expect(expenditure.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      budgetId: budget._id,
      item: 'groceries',
      cost: 64.42,
      dateOfExpenditure: expenditure.dateOfExpenditure,
      __v: 0
    });
  });
});
