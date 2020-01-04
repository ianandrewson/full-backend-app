require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User.js');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to make a new user', () => {
    const user = {
      email: 'test@test.test',
      password: 'password',
      firstName: 'Beatrice',
      lastName: 'LeCroix'
    };
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.test',
          firstName: 'Beatrice',
          lastName: 'LeCroix',
          __v: 0
        });
      });
  });

  it('should be able to signin a user', async() => {
    const user = await User.create({
      email: 'test@test.test',
      password: 'password',
      firstName: 'Beatrice',
      lastName: 'LeCroix'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.test', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          __v: 0
        });
      });
  });

  it('fails to login with an incorrect email', async() => {
    await User.create({
      email: 'test@test.test',
      password: 'password'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'hella@wrong.email', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid email/password. Please try again.'
        });
      });
  });

  it('fails to login a user with an incorrect password', async() => {
    await User.create({
      email: 'test@test.test',
      password: 'password'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.test', password: 'DefinitelyNotMyPassword' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid email or password. Please try again.'
        });
      });
  });

  it('should verify a user is authorized', async() => {
    const user = User.create({
      email: 'test@test.test',
      password: 'password'
    });

    const agent = request.agent(app);

    await agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.test',
          __v: 0
        });
      });
  });
});
