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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _app2.default();
var app = server.expressServer();
var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);
var signedInUser = {};

exports.default = describe('Signin', function () {
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

  it('should not signin a user if password is not correct', function () {
    return _chai2.default.request(app).post('/api/v1/auth/signin').send({
      username: _signupTest.regularUser1.username,
      password: '1345'
    }).then(function (res) {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
    });
  });

  it('should not signin a user if password is not correct', function () {
    return _chai2.default.request(app).post('/api/v1/auth/signin').send({
      username: 'someoneelse',
      password: '1344'
    }).then(function (res) {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
    });
  });
});
//# sourceMappingURL=signinTest.js.map