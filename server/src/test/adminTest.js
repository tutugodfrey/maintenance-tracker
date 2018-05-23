import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { createdRequest1, createdRequest2 } from './userRequestTest';
import { adminUser } from './signupTest';
//import { regularUser1, regularUser2 } from './signupTest';
console.log(adminUser)
const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};

export default describe('Admin Test', () => {
  it('should signin a User in and give a token', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: adminUser.username,
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
  
  describe('get all request', () => {
    it('should return all request', () => {
      return chai.request(app)
        .get(`/secure/api/v1/requests?isAdmin=true`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
        });
    });

    it('should return all request', () => {
      return chai.request(app)
        .get(`/secure/api/v1/requests?isAdmin=false`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(402);
        });
    });
  })
});
