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

var request4 = {
  category: 'electrical',
  description: '',
  urgent: true,
  address: 'somewhere in the world',
  userId: 2,
  status: 'awaiting confirmation'
};

exports.default = describe('Users actions', function () {
  it('should signin a User in and give a token', function () {
    return _chai2.default.request(app).post('/api/v1/auth/signin').send({
      username: _signupTest.regularUser1.username,
      password: '123456'
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
      return _chai2.default.request(app).get('/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
      });
    });

    it('should return not found for the request id that does not exist', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests/1').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });
  });

  describe('Create requests', function () {
    it('should create a new request', function () {
      var request1 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: _signupTest.adminUser.id
      };
      return _chai2.default.request(app).post('/api/v1/users/requests').set('token', signedInUser.token).send(request1).then(function (res) {
        Object.assign(createdRequest1, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(1);
        expect(res.body).to.have.any.keys(['description', 'category', 'userId']);
      });
    });

    it('should create a new request', function () {
      var request2 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: _signupTest.adminUser.id
      };
      return _chai2.default.request(app).post('/api/v1/users/requests').set('token', signedInUser.token).send(request2).then(function (res) {
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
    it('should not create request for users that does not exist', function () {
      var request3 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        userid: 9
      };
      return _chai2.default.request(app).post('/api/v1/users/requests').set('token', signedInUser.token).send(request3).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
      });
    });

    it('should not create request if a required field is not present', function () {
      return _chai2.default.request(app).post('/api/v1/users/requests').set('token', signedInUser.token).send(request4).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });

  // test for get ../users/requests/:requestId
  describe('get one request', function () {
    it('should return a request with the given id for a logged in user', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).get('/api/v1/users/requests/' + id).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.any.keys('userid');
      });
    });

    it('should return not found for requestId that does not exist for a logged in user', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests/20').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return not found for the requestId with no matching userId', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).get('/api/v1/users/requests/' + id).set('token', _signupTest.regularUser2.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return bad request if requestId is invalid', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if neither userId nor requestId is valid', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });

  // test for get ../users/requests
  describe('get all request', function () {
    it('should return all request for logged in user', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length.of.at.least(1);
        expect(res.body).to.deep.include.members([createdRequest1]);
      });
    });

    it('should return an empty array if no matching userId is found', function () {
      return _chai2.default.request(app).get('/api/v1/users/requests').set('token', _signupTest.regularUser2.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });
  });

  describe('Users request update', function () {
    it('users should be able to modify the other field except the status of a request', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).put('/api/v1/users/requests/' + id).set('token', signedInUser.token).send({
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.description).to.equal('wall socket got burned and need replacement');
      });
    });

    it('users should not be able to modify the status of a request', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).put('/api/v1/users/requests/' + id).set('token', signedInUser.token).send({
        status: 'approved'
      }).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('awaiting confirmation');
      });
    });

    it('should return not found for a request that does not exist', function () {
      return _chai2.default.request(app).put('/api/v1/users/requests/20').set('token', signedInUser.token).send({
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
      });
    });

    it('should return not found for a request if userId does not match', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(app).put('/api/v1/users/requests/' + id).set('token', _signupTest.regularUser2.token).send({
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
      var id = createdRequest2.id;

      return _chai2.default.request(app).delete('/api/v1/users/requests/' + id).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request has been deleted' });
      });
    });

    it('should return not found for a request that does not exist', function () {
      return _chai2.default.request(app).delete('/api/v1/users/requests/15').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found, not action taken' });
      });
    });

    it('should return bad request if requestId is not specified params', function () {
      return _chai2.default.request(app).delete('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if requestId and userId is invalid', function () {
      return _chai2.default.request(app).delete('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
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