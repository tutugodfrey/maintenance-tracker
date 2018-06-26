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
  status: 'awaiting confirmation'
};

exports.default = describe('Requests controller', function () {
  it('should signin a User in and give a token', function () {
    return _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send({
      username: _signupTest.regularUser1.username,
      password: '123456'
    }).then(function (res) {
      Object.assign(signedInUser, res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.be.a('string');
      expect(res.body.isAdmin).to.equal(false);
    });
  });

  describe('empty table', function () {
    it('should return an empty array', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });

    it('should return not found for the request id that does not exist', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/1').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });
  });

  describe('Create requests method', function () {
    it('should create a new request', function () {
      var request1 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: _signupTest.adminUser.id
      };
      return _chai2.default.request(_app2.default).post('/api/v1/users/requests').set('token', signedInUser.token).send(request1).then(function (res) {
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
      return _chai2.default.request(_app2.default).post('/api/v1/users/requests').set('token', signedInUser.token).send(request2).then(function (res) {
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
    it('should not create request for a service (adminId) that does not exist', function () {
      var request3 = {
        category: 'electrical',
        description: 'Socket burned',
        urgent: true,
        address: 'somewhere in the world',
        adminId: 9
      };
      return _chai2.default.request(_app2.default).post('/api/v1/users/requests').set('token', signedInUser.token).send(request3).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('service not found');
      });
    });

    it('should not create request if a required field is not present', function () {
      return _chai2.default.request(_app2.default).post('/api/v1/users/requests').set('token', signedInUser.token).send(request4).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });

  // test for get ../users/requests/:requestId
  describe('get one request method ', function () {
    it('should return a request with the given id for a logged in user', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/' + id).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('request');
        expect(res.body).to.have.property('user');
        expect(res.body.request).to.have.any.keys('userId');
        expect(res.body.request.userId).to.equal(signedInUser.id);
        expect(res.body.user.serviceName).to.equal(_signupTest.adminUser.serviceName);
      });
    });

    it('should return not found for requestId that does not exist for a logged in user', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/20').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return not found for the requestId with no matching userId', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/' + id).set('token', _signupTest.regularUser2.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'request not found' });
      });
    });

    it('should return bad request if requestId is invalid', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return authorization error when token is invalid', function () {
      var id = createdRequest1.id;

      return _chai2.default.request(_app2.default).get('/api/v1/users/requests/' + id).set('token', 'signedInUser.token.invalidtoken').then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'authentication fail! invalid token' });
      });
    });
  });

  // test for get ../users/requests
  describe('get all request', function () {
    it('should return authorization error if token is invalid', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests').set('token', 'regularUser2.tokeninvalidtoken').then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! invalid token');
      });
    });

    it('should return authorization error if token is not provided', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests').then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! please send a token');
      });
    });

    it('should return all request for logged in user', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length.of.at.least(1);
        expect(res.body[0]).to.have.property('request');
        expect(res.body[0]).to.have.property('user');
        expect(res.body[0].user).to.have.property('serviceName');
        expect(res.body[0].user.serviceName).to.equal(_signupTest.adminUser.serviceName);
        expect(res.body[0].request).to.eql(createdRequest1);
      });
    });

    it('should return an empty array if no request exist for the logged in user', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/users/requests').set('token', _signupTest.regularUser2.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });
  });

  describe('Update request method', function () {
    it('users should be able to modify the other field except the status of a request', function () {
      var id = createdRequest1.id,
          adminId = createdRequest1.adminId;

      return _chai2.default.request(_app2.default).put('/api/v1/users/requests/' + id).set('token', signedInUser.token).send({
        adminId: adminId,
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.request.description).to.equal('wall socket got burned and need replacement');
      });
    });

    it('users should not modify the status of a request', function () {
      var id = createdRequest1.id,
          adminId = createdRequest1.adminId;

      return _chai2.default.request(_app2.default).put('/api/v1/users/requests/' + id).set('token', signedInUser.token).send({
        adminId: adminId,
        status: 'approved'
      }).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.request.status).to.equal('awaiting confirmation');
      });
    });

    it('should return not found for a request that does not exist', function () {
      var adminId = createdRequest1.adminId;

      return _chai2.default.request(_app2.default).put('/api/v1/users/requests/20').set('token', signedInUser.token).send({
        adminId: adminId,
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('request not found');
      });
    });

    it('should return authorization error for invalid token', function () {
      var id = createdRequest1.id,
          adminId = createdRequest1.adminId;

      return _chai2.default.request(_app2.default).put('/api/v1/users/requests/' + id).set('token', 'regularUser2.tokeninvalidtoken').send({
        adminId: adminId,
        description: 'wall socket got burned and need replacement'
      }).then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! invalid token');
      });
    });
  });

  // test for delete ../users/requests/:requestId
  describe('delete request method', function () {
    it('should delete a request', function () {
      var id = createdRequest2.id;

      return _chai2.default.request(_app2.default).delete('/api/v1/users/requests/' + id).set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'request has been deleted' });
      });
    });

    it('should return not found for a request that does not exist', function () {
      return _chai2.default.request(_app2.default).delete('/api/v1/users/requests/15').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'request not found, not action taken' });
      });
    });

    it('should return bad request if requestId is not specified params', function () {
      return _chai2.default.request(_app2.default).delete('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });

    it('should return bad request if requestId is not valid', function () {
      return _chai2.default.request(_app2.default).delete('/api/v1/users/requests/0').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.eql({ message: 'missing required field' });
      });
    });
  });
});
exports.createdRequest1 = createdRequest1;
exports.createdRequest2 = createdRequest2;
//# sourceMappingURL=userRequestTest.js.map