'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _app2.default();
var app = server.expressServer();
var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);

var request1 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending'
};
var request2 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 3,
  status: 'pending'
};

var request3 = {
  category: 'electrical',
  description: 'Socket burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 9,
  status: 'pending'
};

var request4 = {
  category: 'electrical',
  description: '',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending'
};

var message1 = {
  title: 'unresolved request',
  message: 'request to replace wall socket was not attended to',
  userId: 2,
  adminId: 1,
  senderId: 2
};

var message2 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 2,
  adminId: 1,
  senderId: 1
};

var message3 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 2,
  adminId: 1,
  senderId: 7
};

var message4 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 0,
  adminId: 0,
  senderId: 7
};

var message5 = {
  title: 'unresolved request',
  message: ' ',
  userId: 2,
  adminId: 1,
  senderId: 2
};

var adminUser = {};
var regularUser1 = {};
var signedInUser = {};
var regularUser2 = {};
var createdRequest1 = {};
var createdRequest2 = {};
var createdMessage1 = {};
var createdMessage2 = {};

// enforce test to run in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log('can\'t run test in non test env. you are in ' + process.env.NODE_ENV + ' environment');
} else {
  describe('API End Points', function () {
    // test home route
    describe('Home', function () {
      it('should return welcome message', function () {
        return _chai2.default.request(app).get('/').then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'welcome to the maintenance trackers' });
        });
      });
    });

    describe('Users signup', function () {
      describe('Admin User', function () {
        it('should create new admin user', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'john doe').field('username', 'johnd').field('email', 'johnd@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('passwd1', '1234').field('passwd2', '1234').field('isAdmin', true).attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
            Object.assign(adminUser, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('Object');
            expect(res.body.isAdmin).to.equal('true');
          });
        });
      });

      describe('Create regular User', function () {
        it('should create new regular user', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterb').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('passwd1', '1234').field('passwd2', '1234').field('isAdmin', false).attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
            Object.assign(regularUser1, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('Object');
          });
        });

        it('file submission should be optional', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'ryan bob').field('username', 'ryanb').field('email', 'raynb@yahoo.com').field('address', 'market road').field('serviceName', '').field('passwd1', '1234').field('passwd2', '1234').field('isAdmin', false).then(function (res) {
            Object.assign(regularUser2, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('Object');
            expect(res.body.password).to.not.equal('1234');
          });
        });

        it('username should be unique ', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'walter brain').field('username', 'walterb').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('passwd1', '1234').field('passwd2', '1234').field('isAdmin', false).attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.eql({ message: 'user already exist' });
          });
        });

        it('email should be unique ', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterbr').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('passwd1', '1234').field('passwd2', '1234').field('isAdmin', false).attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.eql({ message: 'user already exist' });
          });
        });

        it('password, confirm-password should match', function () {
          return _chai2.default.request(app).post('/api/v1/users/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterbr').field('email', 'walterbr@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('passwd1', '12345').field('passwd2', '12349').field('isAdmin', false).attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.eql({ message: 'password does not match' });
          });
        });
      });
    });

    describe('Signin', function () {
      it('should signin a User in and give a token', function () {
        return _chai2.default.request(app).post('/api/v1/users/signin').send({
          username: regularUser1.username,
          password: '1234'
        }).then(function (res) {
          Object.assign(signedInUser, res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
        });
      });

      it('should not signin a user if password is not correct', function () {
        return _chai2.default.request(app).post('/api/v1/users/signin').send({
          username: regularUser1.username,
          password: '1345'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
        });
      });

      it('should not signin a user if password is not correct', function () {
        return _chai2.default.request(app).post('/api/v1/users/signin').send({
          username: 'someoneelse',
          password: '1344'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
        });
      });
    });

    describe('Empty request model', function () {
      it('should return an empty array', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests').then(function (res) {
          expect(res).to.have.status(400);
        });
      });
      it('should return not found for the request id', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests/1').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return an empty array if no message exist for the model', function () {
        return _chai2.default.request(app).get('/api/v1/contacts?isAdmin=true').then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
      });
    });

    // test for post ../users/requests
    describe('Create requests', function () {
      it('should create a new request', function () {
        return _chai2.default.request(app).post('/api/v1/users/requests').send(request1).then(function (res) {
          Object.assign(createdRequest1, res.body.request);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.request.id).to.equal(1);
          expect(res.body.request).to.have.any.keys(['description', 'category', 'userId']);
        });
      });

      it('should create a new request', function () {
        return _chai2.default.request(app).post('/api/v1/users/requests').send(request2).then(function (res) {
          Object.assign(createdRequest2, res.body.request);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.request.id).to.equal(2);
          expect(res.body.request).to.have.any.keys('description');
          expect(res.body.request).to.have.any.keys('category');
          expect(res.body.request).to.have.any.keys('userId');
        });
      });
      it('should not create request for users that does not exist', function () {
        return _chai2.default.request(app).post('/api/v1/users/requests').send(request3).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not create request if a required field is not present', function () {
        return _chai2.default.request(app).post('/api/v1/users/requests').send(request4).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });

    // test for get ../users/requests/:requestId
    describe('get one request', function () {
      it('should return a request with the given id for a logged in user', function () {
        var id = createdRequest1.id,
            userId = createdRequest1.userId;

        return _chai2.default.request(app).get('/api/v1/users/requests/' + id + '?userId=' + userId).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.any.keys('userId');
        });
      });

      it('should return not found for requestId that does not exist for a logged in user', function () {
        var userId = createdRequest1.userId;

        return _chai2.default.request(app).get('/api/v1/users/requests/5?userId=' + userId).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
        });
      });

      it('should return not found for the requestId with no matching userId', function () {
        var id = createdRequest1.id;

        return _chai2.default.request(app).get('/api/v1/users/requests/' + id + '?userId=6').then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
        });
      });

      it('should return bad request if either userId nor requestId is invalid', function () {
        var id = createdRequest1.id;

        return _chai2.default.request(app).get('/api/v1/users/requests/' + id + '?userId=0').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return bad request if either userId nor requestId is invalid', function () {
        var userId = createdRequest1.userId;

        return _chai2.default.request(app).get('/api/v1/users/requests/0?userId=' + userId).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return bad request if neither userId nor requestId is valid', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests/0?userId=0').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });

    // test for get ../users/requests
    describe('get all request', function () {
      it('should return all request for logged in user', function () {
        var userId = createdRequest1.userId;

        return _chai2.default.request(app).get('/api/v1/users/requests?userId=' + userId).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
          expect(res.body).to.deep.include.members([createdRequest1]);
        });
      });

      it('should return an empty array if no matching userId is found', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests?userId=5').then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
      });

      it('should return bad request if userId is not supplied in query', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });

    // test for delete ../users/requests/:requestId
    describe('delete request', function () {
      it('should delete a request', function () {
        var id = createdRequest2.id,
            userId = createdRequest2.userId;

        return _chai2.default.request(app).delete('/api/v1/users/requests/' + id + '?userId=' + userId).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request has been deleted' });
        });
      });

      it('should return not found request that does not exist', function () {
        var userId = createdRequest2.userId;

        return _chai2.default.request(app).delete('/api/v1/users/requests/4?userId=' + userId).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found, not action taken' });
        });
      });

      it('should not delete a request belonging to another person', function () {
        var userId = createdRequest2.userId;
        var id = createdRequest1.id;

        return _chai2.default.request(app).delete('/api/v1/users/requests/' + id + '?userId=' + userId).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found, not action taken' });
        });
      });

      it('should return bad request if requestId is not specified params', function () {
        var userId = createdRequest2.userId;

        return _chai2.default.request(app).delete('/api/v1/users/requests/0?userId=' + userId).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return bad request if requestId and userId is invalid', function () {
        return _chai2.default.request(app).delete('/api/v1/users/requests/0?userId=0').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return bad request if requestId is given but userId is not specified in query', function () {
        var id = createdRequest2.id;

        return _chai2.default.request(app).delete('/api/v1/users/requests/' + id).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });

    // test for put ../users/requests/:requestId
    describe('update request', function () {
      describe('Users', function () {
        it('users should be able to modify the other field except the status of a request', function () {
          var id = createdRequest1.id,
              userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=' + userId).send({
            description: 'wall socket got burned and need replacement'
          }).then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.description).to.equal('wall socket got burned and need replacement');
          });
        });

        it('users should not be able to modify the status of a request', function () {
          var id = createdRequest1.id,
              userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=' + userId + '&isAdmin=').send({
            status: 'approved'
          }).then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('pending');
          });
        });

        it('should return not found for a request that does not exist', function () {
          var userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/4?userId=' + userId).send({
            description: 'wall socket got burned and need replacement'
          }).then(function (res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
        });

        it('should return not found for a request with no matching userId', function () {
          var id = createdRequest1.id;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=10').send({
            description: 'wall socket got burned and need replacement'
          }).then(function (res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
        });
      });

      describe('Admin', function () {
        it('admin should be able to modify the status of a request', function () {
          var id = createdRequest1.id,
              userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=' + userId + '&isAdmin=true').send({
            status: 'approved'
          }).then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('approved');
          });
        });

        it('admin should not be able to modify the other field except the status of a request', function () {
          var id = createdRequest1.id,
              userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=' + userId + '&isAdmin=true').send({
            description: 'wall socket is bad and need replacement'
          }).then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.description).to.equal('wall socket got burned and need replacement');
          });
        });

        it('admin should not be able to modify a request that does not exist', function () {
          var userId = createdRequest1.userId;

          return _chai2.default.request(app).put('/api/v1/users/requests/5?userId=' + userId + '&isAdmin=true').send({
            status: 'rejected'
          }).then(function (res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
        });

        it('admin should not be able to modify a request with no matching userId', function () {
          var id = createdRequest1.id;

          return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=3&isAdmin=true').send({
            status: 'resolved'
          }).then(function (res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
        });
      });

      it('should return bad request if userId is not present in query', function () {
        return _chai2.default.request(app).put('/api/v1/users/requests/4').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });

      it('should return bad request if requestId is not specified params', function () {
        return _chai2.default.request(app).put('/api/v1/users/requests/0?userId={userId}').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should return bad request if userId is not specified query', function () {
        var id = createdRequest1.id;

        return _chai2.default.request(app).put('/api/v1/users/requests/' + id + '?userId=').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });

      it('should not update if neither userId nor requestId exist', function () {
        return _chai2.default.request(app).put('/api/v1/users/requests/6?userId=7').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });
    });

    // tests for the contact model
    describe('contacts', function () {
      describe('add contacts messages', function () {
        it('users should be able to send message to the admin', function () {
          return _chai2.default.request(app).post('/api/v1/contacts').send(message1).then(function (res) {
            Object.assign(createdMessage1, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
          });
        });

        it('admin should be able to reply a message', function () {
          return _chai2.default.request(app).post('/api/v1/contacts').send(message2).then(function (res) {
            Object.assign(createdMessage2, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
          });
        });

        it('should return bad request if required fields are not presents', function () {
          return _chai2.default.request(app).post('/api/v1/contacts').send(message3).then(function (res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
        });

        it('should not create a message for a sender that does not exist', function () {
          return _chai2.default.request(app).post('/api/v1/contacts').send(message4).then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
        });

        it('should not create a message if no message is posted', function () {
          return _chai2.default.request(app).post('/api/v1/contacts').send(message5).then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
        });
      });

      describe('get messages', function () {
        it('should return all messages for the given userId', function () {
          return _chai2.default.request(app).get('/api/v1/contacts?userId=2').then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
          });
        });

        it('should return an empty array if no message exist for the given userId', function () {
          return _chai2.default.request(app).get('/api/v1/contacts?userId=9').then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
          });
        });

        it('should return all messages if isAdmin === true', function () {
          return _chai2.default.request(app).get('/api/v1/contacts?isAdmin=true').then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
          });
        });

        it('should return bad request if neither isAdim or userId is not set', function () {
          return _chai2.default.request(app).get('/api/v1/contacts?userId=&isAdmin=').then(function (res) {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ message: 'missing required field' });
          });
        });
      });
    });
  });
}
//# sourceMappingURL=endpointTests.js.map