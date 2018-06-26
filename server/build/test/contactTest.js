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

var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);
var signedInUser = {};

var userMessage = {
  title: 'unresolved request',
  message: '',
  receiverId: _signupTest.adminUser.id
};

var adminMessage = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  receiverId: _signupTest.regularUser1.id
};

var createdMessage1 = {};
var createdMessage2 = {};

// tests for the contact model
exports.default = describe('contacts controller', function () {
  describe('user send message', function () {
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
      });
    });

    it('should return bad request if message is null', function () {
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', signedInUser.token).send(userMessage).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('missing required field');
      });
    });

    it('should not create a message if receiverId is not provided', function () {
      userMessage.receiverId = '';
      userMessage.message = 'request to replace wall socket was not attended to';
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', signedInUser.token).send(userMessage).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('missing required field');
      });
    });

    it('should not create a message if receiver does not exist', function () {
      userMessage.receiverId = 20;
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', signedInUser.token).send(userMessage).then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('receiver does not exist');
      });
    });

    it('users should be able to send message to the admin', function () {
      userMessage.receiverId = _signupTest.adminUser.id;
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', signedInUser.token).send(userMessage).then(function (res) {
        Object.assign(createdMessage1, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('senderId');
        expect(res.body).to.have.property('receiverId');
        expect(res.body).to.have.property('title');
        expect(res.body.senderId).to.equal(signedInUser.id);
      });
    });
  });

  describe('admin reply users messages', function () {
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

    it('should return authentication error if token is invalid', function () {
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', 'signedInUser.tokeninvalidtoken').send(adminMessage).then(function (res) {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('authentication fail! invalid token');
      });
    });

    it('admin should be able to reply a message', function () {
      adminMessage.receiverId = _signupTest.regularUser1.id;
      return _chai2.default.request(_app2.default).post('/api/v1/contacts').set('token', signedInUser.token).send(adminMessage).then(function (res) {
        Object.assign(createdMessage2, res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('senderId');
        expect(res.body).to.have.property('receiverId');
        expect(res.body).to.have.property('title');
        expect(res.body.senderId).to.equal(_signupTest.adminUser.id);
      });
    });
  });

  describe('get messages', function () {
    it('should return all messages for the given userId', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/contacts').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
        expect(res.body[0]).to.have.property('message');
        expect(res.body[0]).to.have.property('sender');
        expect(res.body[0]).to.have.property('receiver');
      });
    });

    it('should return an empty array if no message exist for the logged in user', function () {
      return _chai2.default.request(_app2.default).get('/api/v1/contacts')
      // regularuser2 does not have any messages
      .set('token', _signupTest.regularUser2.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });
  });
});
//# sourceMappingURL=contactTest.js.map