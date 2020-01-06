require('dotenv').config();
const connect = require('../utils/connect.js');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('User model test', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should have a required email', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.email.message).toEqual('Path `email` is required.');
  });

  it('should have a required password', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });

  it('should be able to make a new user', async() => {
    const user = await User.create({
      email: 'test@test.test',
      password: 'password',
      firstName: 'Pontifex',
      lastName: 'Maximus'
    });
    expect(user.toJSON()).toEqual({
      _id: user._id,
      email: 'test@test.test',
      firstName: 'Pontifex',
      lastName: 'Maximus',
      __v: 0
    });
  });
});
