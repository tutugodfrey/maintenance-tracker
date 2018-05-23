'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createdRequest2 = exports.createdRequest1 = undefined;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

var _signupTest = require('./signupTest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _app2.default();
var app = server.expressServer();
var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);
var signedInUser = {};
var createdRequest1 = {};
var createdRequest2 = {};

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

exports.default = describe('Users actions', function () {
  it('should signin a User in and give a token', function () {
    return _chai2.default.request(app).post('/api/v1/auth/signin').send({
      username: _signupTest.regularUser1.username,
      password: '1234'
    }).then(function (res) {
      Object.assign(signedInUser, res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.be.a('string');
    });
  });

  describe('Empty request model', function () {
    it('should return an empty array', function () {
      return _chai2.default.request(app).get('/secure/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
      });
    });

    it('should return not found for the request id', function () {
      return _chai2.default.request(app).get('/secure/api/v1/users/requests/1').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });

  describe('Create requests', function () {
    it('should create a new request', function () {
      var request1 = {
        category: 'electrical',
        description: 'Socket burned',
        urgency: 'urgent',
        department: 'baking',
        userId: signedInUser.userId,
        status: 'pending'
      };
      return _chai2.default.request(app).post('/secure/api/v1/users/requests').set('token', signedInUser.token).send(request1).then(function (res) {
        Object.assign(createdRequest1, res.body.request);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.request.id).to.equal(1);
        expect(res.body.request).to.have.any.keys(['description', 'category', 'userId']);
      });
    });

    it('should create a new request', function () {
      var request2 = {
        category: 'electrical',
        description: 'Socket burned',
        urgency: 'urgent',
        department: 'baking',
        userId: signedInUser.userId,
        status: 'pending'
      };
      return _chai2.default.request(app).post('/secure/api/v1/users/requests').set('token', signedInUser.token).send(request2).then(function (res) {
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
      return _chai2.default.request(app).post('/secure/api/v1/users/requests').set('token', signedInUser.token).send(request3).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
      });
    });

    it('should not create request if a required field is not present', function () {
      return _chai2.default.request(app).post('/secure/api/v1/users/requests').set('token', signedInUser.token).send(request4).then(function (res) {
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

      return _chai2.default.request(app).get('/secure/api/v1/users/requests/' + id + '?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.any.keys('userId');
      });
    });

    it('should return not found for requestId that does not exist for a logged in user', function () {
      var userId = createdRequest1.userId;

      return _chai2.default.request(app).get('/secure/api/v1/users/requests/5?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return not found for the requestId with no matching userId', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).get('/secure/api/v1/users/requests/' + id + '?userId=6').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return bad request if either userId nor requestId is invalid', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).get('/secure/api/v1/users/requests/' + id + '?userId=0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if either userId nor requestId is invalid', function () {
      var userId = createdRequest1.userId;

      return _chai2.default.request(app).get('/secure/api/v1/users/requests/0?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if neither userId nor requestId is valid', function () {
      return _chai2.default.request(app).get('/secure/api/v1/users/requests/0?userId=0').set('token', signedInUser.token).then(function (res) {
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

      return _chai2.default.request(app).get('/secure/api/v1/users/requests?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length.of.at.least(1);
        expect(res.body).to.deep.include.members([createdRequest1]);
      });
    });

    it('should return an empty array if no matching userId is found', function () {
      return _chai2.default.request(app).get('/secure/api/v1/users/requests?userId=10').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });

    it('should return bad request if userId is not supplied in query', function () {
      return _chai2.default.request(app).get('/secure/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });

  describe('Users request update', function () {
    it('users should be able to modify the other field except the status of a request', function () {
      var id = createdRequest1.id,
          userId = createdRequest1.userId;

      return _chai2.default.request(app).put('/secure/api/v1/users/requests/' + id + '?userId=' + userId).set('token', signedInUser.token).send({
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

      return _chai2.default.request(app).put('/secure/api/v1/users/requests/' + id + '?userId=' + userId + '&isAdmin=').set('token', signedInUser.token).send({
        status: 'approved'
      }).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('pending');
      });
    });

    it('should return not found for a request that does not exist', function () {
      var userId = createdRequest1.userId;

      return _chai2.default.request(app).put('/secure/api/v1/users/requests/4?userId=' + userId).set('token', signedInUser.token).send({
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
      });
    });

    it('should return not found for a request with no matching userId', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).put('/secure/api/v1/users/requests/' + id + '?userId=10').set('token', signedInUser.token).send({
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
      });
    });
  });

  // test for delete ../users/requests/:requestId
  describe('delete request', function () {
    it('should delete a request', function () {
      var id = createdRequest2.id,
          userId = createdRequest2.userId;

      return _chai2.default.request(app).delete('/secure/api/v1/users/requests/' + id + '?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request has been deleted' });
      });
    });

    it('should return not found request that does not exist', function () {
      var userId = createdRequest2.userId;

      return _chai2.default.request(app).delete('/secure/api/v1/users/requests/4?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found, not action taken' });
      });
    });

    it('should return bad request if requestId is not specified params', function () {
      var userId = createdRequest2.userId;

      return _chai2.default.request(app).delete('/secure/api/v1/users/requests/0?userId=' + userId).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if requestId and userId is invalid', function () {
      return _chai2.default.request(app).delete('/secure/api/v1/users/requests/0?userId=0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if requestId is given but userId is not specified in query', function () {
      var id = createdRequest2.id;

      return _chai2.default.request(app).delete('/secure/api/v1/users/requests/' + id).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });
});
exports.createdRequest1 = createdRequest1;
exports.createdRequest2 = createdRequest2;
//# sourceMappingURL=userRequestTest.js.map