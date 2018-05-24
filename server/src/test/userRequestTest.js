import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { regularUser1 } from './signupTest';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};
const createdRequest1 = {};
const createdRequest2 = {};

const request3 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 9,
  status: 'pending',
};

const request4 = {
  category: 'electrical',
  description: '',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending',
};

export default describe('Users actions', () => {
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

  describe('Empty request model', () => {
    it('should return an empty array', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
        });
    });

    it('should return not found for the request id', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/1')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });

  describe('Create requests', () => {
    it('should create a new request', () => {
      const request1 = {
        category: 'electrical',
        description: 'Socket burned',
        urgency: 'urgent',
        department: 'baking',
        userId: signedInUser.userId,
        status: 'pending',
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request1)
        .then((res) => {
          Object.assign(createdRequest1, res.body.request);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.request.id).to.equal(1);
          expect(res.body.request).to.have.any.keys(['description', 'category', 'userId']);
        });
    });

    it('should create a new request', () => {
      const request2 = {
        category: 'electrical',
        description: 'Socket burned',
        urgency: 'urgent',
        department: 'baking',
        userId: signedInUser.userId,
        status: 'pending',
      };
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request2)
        .then((res) => {
          Object.assign(createdRequest2, res.body.request);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.request.id).to.equal(2);
          expect(res.body.request).to.have.any.keys('description');
          expect(res.body.request).to.have.any.keys('category');
          expect(res.body.request).to.have.any.keys('userId');
        });
    });
    it('should not create request for users that does not exist', () => {
      return chai.request(app)
        .post('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .send(request3)
        .then((res) => {
          expect(res).to.have.status(404);
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
      const { id, userId } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.any.keys('userId');
        });
    });

    it('should return not found for requestId that does not exist for a logged in user', () => {
      const { userId } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/5?userId=${userId}`)
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
        .get(`/api/v1/users/requests/${id}?userId=6`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
        });
    });

    it('should return bad request if either userId nor requestId is invalid', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/${id}?userId=0`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if either userId nor requestId is invalid', () => {
      const { userId } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests/0?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if neither userId nor requestId is valid', () => {
      return chai.request(app)
        .get('/api/v1/users/requests/0?userId=0')
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
      const { userId } = createdRequest1;
      return chai.request(app)
        .get(`/api/v1/users/requests?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
          expect(res.body).to.deep.include.members([createdRequest1]);
        });
    });

    it('should return an empty array if no matching userId is found', () => {
      return chai.request(app)
        .get('/api/v1/users/requests?userId=10')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
    });

    it('should return bad request if userId is not supplied in query', () => {
      return chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });

  describe('Users request update', () => {
    it('users should be able to modify the other field except the status of a request', () => {
      const { id, userId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}?userId=${userId}`)
        .set('token', signedInUser.token)
        .send({
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.description).to.equal('wall socket got burned and need replacement');
        });
    });

    it('users should not be able to modify the status of a request', () => {
      const { id, userId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}?userId=${userId}&isAdmin=`)
        .set('token', signedInUser.token)
        .send({
          status: 'approved',
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('pending');
        });
    });

    it('should return not found for a request that does not exist', () => {
      const { userId } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/4?userId=${userId}`)
        .set('token', signedInUser.token)
        .send({
          description: 'wall socket got burned and need replacement',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
    });

    it('should return not found for a request with no matching userId', () => {
      const { id } = createdRequest1;
      return chai.request(app)
        .put(`/api/v1/users/requests/${id}?userId=10`)
        .set('token', signedInUser.token)
        .send({
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
      const { id, userId } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/${id}?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request has been deleted' });
        });
    });

    it('should return not found request that does not exist', () => {
      const { userId } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/4?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found, not action taken' });
        });
    });

    it('should return bad request if requestId is not specified params', () => {
      const { userId } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/0?userId=${userId}`)
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if requestId and userId is invalid', () => {
      return chai.request(app)
        .delete('/api/v1/users/requests/0?userId=0')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });

    it('should return bad request if requestId is given but userId is not specified in query', () => {
      const { id } = createdRequest2;
      return chai.request(app)
        .delete(`/api/v1/users/requests/${id}`)
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
