import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';
import { adminUser, regularUser1 } from './signupTest';
import { createdRequest1 } from './userRequestTest';

const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};

export default describe('Admin controller test', () => {
  it('should signin a User in and give a token', () => {
    return chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: adminUser.username,
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

  describe('get all requests method', () => {
    it('should return all request', () => {
      return chai.request(app)
        .get('/api/v1/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
          expect(res.body[0]).to.have.property('request');
          expect(res.body[0]).to.have.property('user');
          expect(res.body[0].user.fullname).to.equal(regularUser1.fullname);
        });
    });

    it('should return 401 status code for unauthorized user', () => {
      return chai.request(app)
        .get('/api/v1/requests')
        .set('token', regularUser1.token)
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('you are not authorized to perform this action');
        });
    });
  });

  describe('Update requests', () => {
    describe('approve request method', () => {
      it('should update a request status to pending when approved', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/approve`)
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('request');
            expect(res.body).to.have.property('user');
            expect(res.body.request.status).to.equal('pending');
          });
      });

      it('users should not be able to mark their requests as approve', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/approve`)
          .set('token', regularUser1.token)
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.eql('you are not authorized to perform this action');
          });
      });

      it('should not update a request that does not exist', () => {
        return chai.request(app)
          .put('/api/v1/requests/10/approve')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('request not found');
          });
      });

      it('should return bad request if requestId is not set', () => {
        return chai.request(app)
          .put('/api/v1/requests/0/approve')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('missing required field');
          });
      });
    });

    describe('reject request method', () => {
      it('should reject a request', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/disapprove`)
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('request');
            expect(res.body).to.have.property('user');
            expect(res.body.request.status).to.equal('rejected');
          });
      });

      it('users should not be able to disapprove a request', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/disapprove`)
          .set('token', regularUser1.token)
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.eql('you are not authorized to perform this action');
          });
      });

      it('should not update a request that does not exist', () => {
        return chai.request(app)
          .put('/api/v1/requests/10/disapprove')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('request not found');
          });
      });

      it('should return bad request if requestId is not set', () => {
        return chai.request(app)
          .put('/api/v1/requests/0/disapprove')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('missing required field');
          });
      });
    });

    describe('resolve request method', () => {
      it('should mark a request as resolve', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/resolve`)
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('request');
            expect(res.body).to.have.property('user');
            expect(res.body.request.status).to.equal('resolved');
          });
      });

      it('users should not be able to resolve their requests', () => {
        return chai.request(app)
          .put(`/api/v1/requests/${createdRequest1.id}/resolve`)
          .set('token', regularUser1.token)
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.eql('you are not authorized to perform this action');
          });
      });

      it('should not update a request that does not exist', () => {
        return chai.request(app)
          .put('/api/v1/requests/10/resolve')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('request not found');
          });
      });

      it('should return bad request if requestId is not set', () => {
        return chai.request(app)
          .put('/api/v1/requests/0/resolve')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('missing required field');
          });
      });
    });
  });
});
