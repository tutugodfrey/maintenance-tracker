import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);

const request1 = {
  category: 'electrical',
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 1,
  status: 'pending',
};
const request2 = {
  category: 'electrical',
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending',
};

const request3 = {
  category: 'electrical',
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 4,
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
const createdRequest1 = {};
const createdRequest2 = {};
// enforce test to run in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log(`can't run test in non test env. you are in ${process.env.NODE_ENV} environment`);
} else {
  describe('API End Points', () => {
    // test home route
    describe('Home', () => {
      it('should return welcome message', () => {
        return chai.request(app)
          .get('/')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.eql({ message: 'welcome to the maintenance trackers' });
          });
      });
    });

    describe('Empty request model', () => {
      it('should return an empty array', () => {
        return chai.request(app)
          .get('/api/v1/users/requests')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
      });
      it('should return not found for the request id', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/1')
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'request not found' });
          });
      });
    });

    // test for post ../users/requests
    describe('Create requests', () => {
      it('should create a new request', () => {
        return chai.request(app)
          .post('/api/v1/users/requests')
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
        return chai.request(app)
          .post('/api/v1/users/requests')
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
          .send(request3)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
      });

      it('should not create request if a required field is not present', () => {
        return chai.request(app)
          .post('/api/v1/users/requests')
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
      it('should return a request with the given id', () => {
        const { id } = createdRequest1;
        return chai.request(app)
          .get(`/api/v1/users/requests/${id}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.any.keys('userId');
          });
      });

      it('should return not found for the request that does not exist', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/5')
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'request not found' });
          });
      });

      it('should return 400 error for bad request', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/0')
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });
    });

    // test for get ../users/requests
    describe('get all request', () => {
      it('should return all request', () => {
        return chai.request(app)
          .get('/api/v1/users/requests')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.of.at.least(2);
            expect(res.body).to.deep.include.members([createdRequest1, createdRequest2]);
          });
      });
    });

    // test for delete ../users/requests/:requestId
    describe('delete request', () => {
      it('should delete a request', () => {
        const { id } = createdRequest2;
        return chai.request(app)
          .delete(`/api/v1/users/requests/${id}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'request has been deleted' });
          });
      });

      it('should return not found request that does not exist', () => {
        return chai.request(app)
          .delete('/api/v1/users/requests/4')
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'request not found, not action taken' });
          });
      });

      it('should return bad request if requestId is not specified params', () => {
        return chai.request(app)
          .delete('/api/v1/users/requests/0')
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });
    });

    // test for put ../users/requests/:requestId
    describe('update request', () => {
      it('should update a request', () => {
        const { id } = createdRequest1;
        return chai.request(app)
          .put(`/api/v1/users/requests/${id}`)
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('approved');
          });
      });

      it('should return not found request that does not exist', () => {
        return chai.request(app)
          .put('/api/v1/users/requests/4')
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
      });

      it('should return bad request if requestId is not specified params', () => {
        return chai.request(app)
          .put('/api/v1/users/requests/0')
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });
    });
  });
}
