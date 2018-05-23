import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { regularUser1, regularUser2 } from './signupTest';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};

export default describe('Signin', () => {
  it('should signin a User in and give a token', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: regularUser1.username,
        password: '1234',
      })
      .then((res) => {
        Object.assign(signedInUser, res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
      });
  });

  it('should not signin a user if password is not correct', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: regularUser1.username,
        password: '1345',
      })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
      });
  });

  it('should not signin a user if password is not correct', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: 'someoneelse',
        password: '1344',
      })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
      });
  });
});
