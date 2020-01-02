const User = require('../models/User');

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
    expect(user).toEqual({
      email: 'test@test.test',
      passwordHash: expect.any(String),
      name: 'Pontifex Maximus',
      firstName: 'Pontifex',
      lastName: 'Maximus'
    });
  });
});
