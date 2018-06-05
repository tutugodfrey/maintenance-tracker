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

var server = new _app2.default();
var app = server.expressServer();
var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);
var signedInUser = {};

exports.default = describe('Admin controller test', function () {
  it('should signin a User in and give a token', function () {
    return _chai2.default.request(app).post('/api/v1/auth/signin').send({
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
      return _chai2.default.request(app).get('/api/v1/requests').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length.of.at.least(1);
      });
    });

    it('should return 402 status code for unauthorized user', function () {
      return _chai2.default.request(app).get('/api/v1/requests').set('token', _signupTest.regularUser1.token).then(function (res) {
        expect(res).to.have.status(402);
      });
    });
  });

  describe('Update a request', function () {
    describe('approve request', function () {
      it('should update a request status to pending when approved', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('pending');
        });
      });

      it('should return all request', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/approve').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(402);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(app).put('/api/v1/requests/10/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(app).put('/api/v1/requests/0/approve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });
    });

    describe('reject request', function () {
      it('should reject a request', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('rejected');
        });
      });

      it('should return all request', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/disapprove').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(402);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(app).put('/api/v1/requests/10/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(app).put('/api/v1/requests/0/disapprove').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });
    });

    describe('resolve request', function () {
      it('should mark a request as resolve', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('resolved');
        });
      });

      it('should not resolve a request', function () {
        return _chai2.default.request(app).put('/api/v1/requests/' + _userRequestTest.createdRequest1.id + '/resolve').set('token', _signupTest.regularUser1.token).then(function (res) {
          expect(res).to.have.status(402);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not update a request that does not exist', function () {
        return _chai2.default.request(app).put('/api/v1/requests/10/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });

      it('should return bad request if requestId is not set', function () {
        return _chai2.default.request(app).put('/api/v1/requests/0/resolve').set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });
    });
  });
});
//# sourceMappingURL=adminTest.js.map