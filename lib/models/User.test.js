const User = require('../models/User');
const mongoose = require('mongoose');

describe('User model test', () => {
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

  it('should be able to make a new user', () => {
    const user = new User({
      email: 'test@test.test',
      password: 'password',
      firstName: 'Pontifex',
      lastName: 'Maximus'
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      email: 'test@test.test',
      firstName: 'Pontifex',
      lastName: 'Maximus'
    });
  });
});
