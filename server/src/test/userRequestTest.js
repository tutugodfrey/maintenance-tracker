import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { regularUser1, regularUser2, adminUser } from './signupTest';

const server = new Server();
const app = server.expressServer();
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
  userId: 2,
  status: 'awaiting confirmation',
};

export default describe('Users controller', () => {
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

  describe('Empty request model', () => {
    it('should return an empty array', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
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

  describe('Create requests', () => {
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
          expect(res.body).to.have.any.keys('userid');
          expect(res.body).to.have.any.keys('adminid');
        });
    });
    it('should not create request for users that does not exist', () => {
      const request3 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        userid: 9,
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request3)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
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
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });

  // test for get ../users/requests/:requestId
  describe('get one request', () => {
    it('should return a request with the given id for a logged in user', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.request).to.have.any.keys('userid');
        });
    });

    it('should return not found for requestId that does not exist for a logged in user', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/20')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
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
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if neither userId nor requestId is valid', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });

  // test for get ../users/requests
  describe('get all request', () => {
    it('should return all request for logged in user', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
          // expect(res.body[0].request).to.deep.include.members([createdRequest1]);
        });
    });

    it('should return an empty array if no matching userId is found', () => {
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

  describe('Users request update', () => {
    it('users should be able to modify the other field except the status of a request', () => {
      const { id, adminid } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .send({
          adminId: adminid,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.description).to.equal('wall socket got burned and need replacement');
        });
    });

    it('users should not be able to modify the status of a request', () => {
      const { id, adminid } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .send({
          adminId: adminid,
          status: 'approved',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('awaiting confirmation');
        });
    });

    it('should return not found for a request that does not exist', () => {
      const { adminid } = createdRequest1;
      return chai.request(app)
        .put('/api/v1/users/requests/20')
        .set('token', signedInUser.token)
        .send({
          adminId: adminid,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
    });

    it('should return not found for a request if userId does not match', () => {
      const { id, adminid } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}`)
        .set('token', regularUser2.token)
        .send({
          adminId: adminid,
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
    });
  });

  // test for delete ../users/requests/:requestId
  describe('delete request', () => {
    it('should delete a request', () => {
      const { id } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/${id}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
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
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if requestId and userId is invalid', () => {
      return chai.request(app)
        .delete('/api/v1/users/requests/0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });
});

export {
  createdRequest1,
  createdRequest2,
};
