'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

var _signupTest = require('./signupTest');

var _userRequestTest = require('./userRequestTest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);
var signedInUser = {};

exports.default = describe('Admin controller test', function () {
  it('should signin a User in and give a token', function () {
    return _chai2.default.request(_app2.default).post('/api/v1/auth/signin').send({
      username: _signupTest.adminUser.username,
      password: '123456'
    }).then(function (res) {
      Object.assign(signedInUser, res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.be.a('string');
    });
  });

  describe('get all requests method', function () {
    it('should return all request', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length.of.at.least(1);
        expect(res.body[0]).to.have.property('request');
        expect(res.body[0]).to.have.property('user');
        expect(res.body[0].user.fullname).to.equal(_signupTest.regularUser1.fullname);
      });
    });

    it('should return 401 status code for unauthorized user', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/requests').set('token', _signupTest.regularUser1.token).then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('you are not authorized to perform this action');
      });
    });
  });

  describe('Update requests', function () {
    describe('approve request method', function () {
      it('should update a request status to pending when approved', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('request');
          expect(res.body).to.have.property('user');
          expect(res.body.request.status).to.equal('pending');
        });
      });

      it('users should not be able to mark their requests as approve', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/approve').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('you are not authorized to perform this action');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/10/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('request not found');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/0/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('missing required field');
        });
      });
    });

    describe('reject request method', function () {
      it('should reject a request', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('request');
          expect(res.body).to.have.property('user');
          expect(res.body.request.status).to.equal('rejected');
        });
      });

      it('users should not be able to disapprove a request', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/disapprove').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('you are not authorized to perform this action');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/10/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('request not found');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/0/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('missing required field');
        });
      });
    });

    describe('resolve request method', function () {
      it('should mark a request as resolve', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('request');
          expect(res.body).to.have.property('user');
          expect(res.body.request.status).to.equal('resolved');
        });
      });

      it('users should not be able to resolve their requests', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/resolve').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('you are not authorized to perform this action');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/10/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('request not found');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(_app2.default).put('/api/v1/requests/0/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('missing required field');
        });
      });
    });
  });
});
//# sourceMappingURL=adminTest.js.map