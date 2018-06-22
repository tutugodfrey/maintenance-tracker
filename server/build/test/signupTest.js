'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regularUser2 = exports.regularUser1 = exports.adminUser = undefined;

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
var adminUser = {};
var regularUser1 = {};
var regularUser2 = {};

exports.default = describe('Users controller', function () {
  describe('signup method', function () {
    it('should create new admin user', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'john doe').field('username', 'johnd').field('email', 'johnd@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('password', '123456').field('confirmPassword', '123456').field('isAdmin', 'true').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        Object.assign(adminUser, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('Object');
        expect(res.body.isAdmin).to.equal(true);
      });
    });

    it('should create new regular user', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterb').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', '').field('password', '123456').field('confirmPassword', '123456').field('isAdmin', '').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        Object.assign(regularUser1, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('Object');
      });
    });

    it('file submission should be optional', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'ryan bob').field('username', 'ryanb').field('email', 'raynb@yahoo.com').field('address', 'market road').field('serviceName', '').field('password', '123456').field('confirmPassword', '123456').field('isAdmin', '').attach('profile-photo', '').then(function (res) {
        Object.assign(regularUser2, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('Object');
        expect(res.body.password).to.not.equal('1234');
      });
    });

    it('username should be unique ', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'walter brain').field('username', 'walterb').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('password', '123456').field('confirmPassword', '123456').field('isAdmin', 'false').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.eql({ message: 'user already exist' });
      });
    });

    it('email should be unique ', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterbr').field('email', 'walterb@yahoo.com').field('address', 'market road').field('serviceName', 'mk services').field('password', '123456').field('confirmPassword', '123456').field('isAdmin', 'false').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.eql({ message: 'user already exist' });
      });
    });

    it('password, confirm-password should match', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterbr').field('email', 'walterbr@yahoo.com').field('address', 'market road').field('serviceName', '').field('password', '1234567').field('confirmPassword', '123456').field('isAdmin', '').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.eql({ message: 'password does not match' });
      });
    });
    it('length of password or comfirmPassword should be >= 6', function () {
      return _chai2.default.request(app).post('/api/v1/auth/signup').set('Content-Type', 'multipart/form-data').field('fullname', 'brain walter').field('username', 'walterbr').field('email', 'walterbr@yahoo.com').field('address', 'market road').field('serviceName', '').field('password', '12345').field('confirmPassword', '123456').field('isAdmin', '').attach('profile-photo', './fileuploads/tutug.jpeg').then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.eql({ message: 'length of password must not be less than 6' });
      });
    });
  });
});
exports.adminUser = adminUser;
exports.regularUser1 = regularUser1;
exports.regularUser2 = regularUser2;
//# sourceMappingURL=signupTest.js.map