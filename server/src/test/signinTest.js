import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';
import { regularUser1 } from './signupTest';

const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};

export default describe('Signin', () => {
  it('should not signin a user if password is not provided', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: regularUser1.username,
        password: '',
      })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('missing required field');
      });
  });

  it('should not signin a user if username is not provided', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: '',
        password: '123456',
      })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('missing required field');
      });
  });

  it('should not signin a user if password is not correct', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: regularUser1.username,
        password: '134567',
      })
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! check your username or password');
      });
  });

  it('should not signin a user if username is not correct', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: 'someoneelse',
        password: '123456',
      })
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! check your username or password');
      });
  });

  it('should signin a User in and give a token', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: regularUser1.username,
        password: '123456',
      })
      .then((res) => {
        Object.assign(signedInUser, res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
      });
  });
});
