import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';
import { regularUser1, regularUser2, adminUser } from './signupTest';

const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};
const createdRequest1 = {};
const createdRequest2 = {};

const request4 = {
  category: 'electrical',
  description: '',
  urgent: true,
  address: 'somewhere in the world',
  status: 'awaiting confirmation',
};

export default describe('Requests controller', () => {
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
        expect(res.body.isAdmin).to.equal(false);
      });
  });

  describe('empty table', () => {
    it('should return an empty array', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
    });

    it('should return not found for the request id that does not exist', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/1')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
        });
    });
  });

  describe('Create requests method', () => {
    it('should create a new request', () => {
      const request1 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: adminUser.id,
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request1)
        .then((res) => {
          Object.assign(createdRequest1, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(1);
          expect(res.body).to.have.any.keys(['description', 'category', 'userId']);
        });
    });

    it('should create a new request', () => {
      const request2 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: adminUser.id,
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request2)
        .then((res) => {
          Object.assign(createdRequest2, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(2);
          expect(res.body).to.have.any.keys('description');
          expect(res.body).to.have.any.keys('category');
          expect(res.body).to.have.any.keys('userId');
          expect(res.body).to.have.any.keys('adminId');
        });
    });
    it('should not create request for a service (adminId) that does not exist', () => {
      const request3 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: 9,
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request3)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('service not found');
        });
    });

    it('should not create request if a required field is not present', () => {
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request4)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message')
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });

  // test for get ../users/requests/:requestId
  describe('get one request method ', () => {
    it('should return a request with the given id for a logged in user', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('request');
          expect(res.body).to.have.property('user');
          expect(res.body.request).to.have.any.keys('userId');
          expect(res.body.request.userId).to.equal(signedInUser.id);
          expect(res.body.user.serviceName).to.equal(adminUser.serviceName);
        });
    });

    it('should return not found for requestId that does not exist for a logged in user', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/20')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'request not found' });
        });
    });

    it('should return not found for the requestId with no matching userId', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}`)
        .set('token', regularUser2.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message')
          expect(res.body).to.eql({ message: 'request not found' });
        });
    });

    it('should return bad request if requestId is invalid', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return authorization error when token is invalid', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}`)
        .set('token', 'signedInUser.token.invalidtoken')
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'authentication fail! invalid token' });
        });
    });
  });

  // test for get ../users/requests
  describe('get all request', () => {
    it('should return authorization error if token is invalid', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', 'regularUser2.tokeninvalidtoken')
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('authentication fail! invalid token')
        });
    });

    it('should return authorization error if token is not provided', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('authentication fail! please send a token')
        });
    });

    it('should return all request for logged in user', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
          expect(res.body[0]).to.have.property('request');
          expect(res.body[0]).to.have.property('user');
          expect(res.body[0].user).to.have.property('serviceName');
          expect(res.body[0].user.serviceName).to.equal(adminUser.serviceName);
          expect(res.body[0].request).to.eql(createdRequest1);
        });
    });

    it('should return an empty array if no request exist for the logged in user', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', regularUser2.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
    });
  });

  describe('Update request method', () => {
    it('users should be able to modify the other field except the status of a request', () => {
      const { id, adminId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .send({
          adminId: adminId,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.request.description).to.equal('wall socket got burned and need replacement');
        });
    });

    it('users should not modify the status of a request', () => {
      const { id, adminId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .send({
          adminId: adminId,
          status: 'approved',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.request.status).to.equal('awaiting confirmation');
        });
    });

    it('should return not found for a request that does not exist', () => {
      const { adminId } = createdRequest1;
      return chai.request(app)
        .put('/api/v1/users/requests/20')
        .set('token', signedInUser.token)
        .send({
          adminId,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('request not found');
        });
    });

    it('should return authorization error for invalid token', () => {
      const { id, adminId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', 'regularUser2.tokeninvalidtoken')
        .send({
          adminId,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('authentication fail! invalid token');
        });
    });
  });

  // test for delete ../users/requests/:requestId
  describe('delete request method', () => {
    it('should delete a request', () => {
      const { id } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'request has been deleted' });
        });
    });

    it('should return not found for a request that does not exist', () => {
      return chai.request(app)
        .delete('/api/v1/users/requests/15')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'request not found, not action taken' });
        });
    });

    it('should return bad request if requestId is not specified params', () => {
      return chai.request(app)
        .delete('/api/v1/users/requests/0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if requestId is not valid', () => {
      return chai.request(app)
        .delete('/api/v1/users/requests/0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });
});

export {
  createdRequest1,
  createdRequest2,
};
