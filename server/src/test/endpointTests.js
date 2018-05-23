import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);

const request1 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending',
};
const request2 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 3,
  status: 'pending',
};

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

const message1 = {
  title: 'unresolved request',
  message: 'request to replace wall socket was not attended to',
  userId: 2,
  adminId: 1,
  senderId: 2,
};

const message2 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 2,
  adminId: 1,
  senderId: 1,
};

const message3 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 2,
  adminId: 1,
  senderId: 7,
};

const message4 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 0,
  adminId: 0,
  senderId: 7,
};

const message5 = {
  title: 'unresolved request',
  message: ' ',
  userId: 2,
  adminId: 1,
  senderId: 2,
};

const adminUser = {};
const regularUser1 = {};
const regularUser2 = {};
const createdRequest1 = {};
const createdRequest2 = {};
const createdMessage1 = {};
const createdMessage2 = {};

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

    describe('Users signup', () => {
      describe('Admin User', () => {
        it('should create new admin user', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'john doe')
            .field('username', 'johnd')
            .field('email', 'johnd@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', 'mk services')
            .field('passwd1', '1234')
            .field('passwd2', '1234')
            .field('isAdmin', true)
            .attach('profile-photo', './fileuploads/tutug.jpeg')
            .then((res) => {
              Object.assign(adminUser, res.body);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('Object');
              expect(res.body.isAdmin).to.equal('true');
            });
        });
      });

      describe('Create regular User', () => {
        it('should create new regular user', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'brain walter')
            .field('username', 'walterb')
            .field('email', 'walterb@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', 'mk services')
            .field('passwd1', '1234')
            .field('passwd2', '1234')
            .field('isAdmin', false)
            .attach('profile-photo', './fileuploads/tutug.jpeg')
            .then((res) => {
              Object.assign(regularUser1, res.body);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('Object');
            });
        });

        it('file submission should be optional', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'ryan bob')
            .field('username', 'ryanb')
            .field('email', 'raynb@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', '')
            .field('passwd1', '1234')
            .field('passwd2', '1234')
            .field('isAdmin', false)
            .then((res) => {
              Object.assign(regularUser2, res.body);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('Object');
              expect(res.body.password).to.not.equal('1234');
            });
        });

        it('username should be unique ', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'walter brain')
            .field('username', 'walterb')
            .field('email', 'walterb@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', 'mk services')
            .field('passwd1', '1234')
            .field('passwd2', '1234')
            .field('isAdmin', false)
            .attach('profile-photo', './fileuploads/tutug.jpeg')
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body).to.eql({ message: 'user already exist' });
            });
        });

        it('email should be unique ', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'brain walter')
            .field('username', 'walterbr')
            .field('email', 'walterb@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', 'mk services')
            .field('passwd1', '1234')
            .field('passwd2', '1234')
            .field('isAdmin', false)
            .attach('profile-photo', './fileuploads/tutug.jpeg')
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body).to.eql({ message: 'user already exist' });
            });
        });

        it('password, confirm-password should match', () => {
          return chai.request(app)
            .post('/api/v1/users/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('fullname', 'brain walter')
            .field('username', 'walterbr')
            .field('email', 'walterbr@yahoo.com')
            .field('address', 'market road')
            .field('serviceName', 'mk services')
            .field('passwd1', '12345')
            .field('passwd2', '12349')
            .field('isAdmin', false)
            .attach('profile-photo', './fileuploads/tutug.jpeg')
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body).to.eql({ message: 'password does not match' });
            });
        });
      });
    });

    describe('Empty request model', () => {
      it('should return an empty array', () => {
        return chai.request(app)
          .get('/api/v1/users/requests')
          .then((res) => {
            expect(res).to.have.status(400);
          });
      });
      it('should return not found for the request id', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/1')
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });

      it('should return an empty array if no message exist for the model', () => {
        return chai.request(app)
          .get('/api/v1/contacts?isAdmin=true')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
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
      it('should return a request with the given id for a logged in user', () => {
        const { id, userId } = createdRequest1;
        return chai.request(app)
          .get(`/api/v1/users/requests/${id}?userId=${userId}`)
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
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });

      it('should return bad request if neither userId nor requestId is valid', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/0?userId=0')
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
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.of.at.least(1);
            expect(res.body).to.deep.include.members([createdRequest1]);
          });
      });

      it('should return an empty array if no matching userId is found', () => {
        return chai.request(app)
          .get('/api/v1/users/requests?userId=5')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
          });
      });

      it('should return bad request if userId is not supplied in query', () => {
        return chai.request(app)
          .get('/api/v1/users/requests')
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });
    });

    // test for delete ../users/requests/:requestId
    describe('delete request', () => {
      it('should delete a request', () => {
        const { id, userId } = createdRequest2;
        return chai.request(app)
          .delete(`/api/v1/users/requests/${id}?userId=${userId}`)
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
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'request not found, not action taken' });
          });
      });

      it('should not delete a request belonging to another person', () => {
        const { userId } = createdRequest2;
        const { id } = createdRequest1;
        return chai.request(app)
          .delete(`/api/v1/users/requests/${id}?userId=${userId}`)
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
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });

      it('should return bad request if requestId and userId is invalid', () => {
        return chai.request(app)
          .delete('/api/v1/users/requests/0?userId=0')
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
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });
    });

    // test for put ../users/requests/:requestId
    describe('update request', () => {
      describe('Users', () => {
        it('users should be able to modify the other field except the status of a request', () => {
          const { id, userId } = createdRequest1;
          return chai.request(app)
            .put(`/api/v1/users/requests/${id}?userId=${userId}`)
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
            .send({
              description: 'wall socket got burned and need replacement',
            })
            .then((res) => {
              expect(res).to.have.status(404);
              expect(res.body).to.be.an('object');
            });
        });
      });

      describe('Admin', () => {
        it('admin should be able to modify the status of a request', () => {
          const { id, userId } = createdRequest1;
          return chai.request(app)
            .put(`/api/v1/users/requests/${id}?userId=${userId}&isAdmin=true`)
            .send({
              status: 'approved',
            })
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.equal('approved');
            });
        });

        it('admin should not be able to modify the other field except the status of a request', () => {
          const { id, userId } = createdRequest1;
          return chai.request(app)
            .put(`/api/v1/users/requests/${id}?userId=${userId}&isAdmin=true`)
            .send({
              description: 'wall socket is bad and need replacement',
            })
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.description).to.equal('wall socket got burned and need replacement');
            });
        });

        it('admin should not be able to modify a request that does not exist', () => {
          const { userId } = createdRequest1;
          return chai.request(app)
            .put(`/api/v1/users/requests/5?userId=${userId}&isAdmin=true`)
            .send({
              status: 'rejected',
            })
            .then((res) => {
              expect(res).to.have.status(404);
              expect(res.body).to.be.an('object');
            });
        });

        it('admin should not be able to modify a request with no matching userId', () => {
          const { id } = createdRequest1;
          return chai.request(app)
            .put(`/api/v1/users/requests/${id}?userId=3&isAdmin=true`)
            .send({
              status: 'resolved',
            })
            .then((res) => {
              expect(res).to.have.status(404);
              expect(res.body).to.be.an('object');
            });
        });
      });

      it('should return bad request if userId is not present in query', () => {
        return chai.request(app)
          .put('/api/v1/users/requests/4')
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
      });

      it('should return bad request if requestId is not specified params', () => {
        return chai.request(app)
          .put('/api/v1/users/requests/0?userId={userId}')
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });

      it('should return bad request if userId is not specified query', () => {
        const { id } = createdRequest1;
        return chai.request(app)
          .put(`/api/v1/users/requests/${id}?userId=`)
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
      });

      it('should not update if neither userId nor requestId exist', () => {
        return chai.request(app)
          .put('/api/v1/users/requests/6?userId=7')
          .send({
            status: 'approved',
          })
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
      });
    });

    // tests for the contact model
    describe('contacts', () => {
      describe('add contacts messages', () => {
        it('users should be able to send message to the admin', () => {
          return chai.request(app)
            .post('/api/v1/contacts')
            .send(message1)
            .then((res) => {
              Object.assign(createdMessage1, res.body);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('object');
            });
        });

        it('admin should be able to reply a message', () => {
          return chai.request(app)
            .post('/api/v1/contacts')
            .send(message2)
            .then((res) => {
              Object.assign(createdMessage2, res.body);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('object');
            });
        });

        it('should return bad request if required fields are not presents', () => {
          return chai.request(app)
            .post('/api/v1/contacts')
            .send(message3)
            .then((res) => {
              expect(res).to.have.status(404);
              expect(res.body).to.be.an('object');
            });
        });

        it('should not create a message for a sender that does not exist', () => {
          return chai.request(app)
            .post('/api/v1/contacts')
            .send(message4)
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
            });
        });

        it('should not create a message if no message is posted', () => {
          return chai.request(app)
            .post('/api/v1/contacts')
            .send(message5)
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
            });
        });
      });

      describe('get messages', () => {
        it('should return all messages for the given userId', () => {
          return chai.request(app)
            .get('/api/v1/contacts?userId=2')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('array');
              expect(res.body.length).to.equal(2);
            });
        });

        it('should return an empty array if no message exist for the given userId', () => {
          return chai.request(app)
            .get('/api/v1/contacts?userId=9')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('array');
              expect(res.body.length).to.equal(0);
            });
        });

        it('should return all messages if isAdmin === true', () => {
          return chai.request(app)
            .get('/api/v1/contacts?isAdmin=true')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('array');
              expect(res.body.length).to.equal(2);
            });
        });

        it('should return bad request if neither isAdim or userId is not set', () => {
          return chai.request(app)
            .get('/api/v1/contacts?userId=&isAdmin=')
            .then((res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body).to.eql({ message: 'missing required field' });
            });
        });
      });
    });
  });
}
