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
var message4 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 0,
  senderId: 7
};

var message5 = {
  title: 'unresolved request',
  message: ' ',
  receiverId: _signupTest.adminUser.id,
  senderId: _signupTest.regularUser1.id
};

var createdMessage1 = {};
var createdMessage2 = {};

// tests for the contact model
exports.default = describe('contacts', function () {
  describe('user send message', function () {
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

    describe('user sending messages', function () {
      it('users should be able to send message to the admin', function () {
        var userMessage = {
          title: 'unresolved request',
          message: 'request to replace wall socket was not attended to',
          receiverId: _signupTest.adminUser.id,
          senderId: signedInUser.id
        };
        return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(userMessage).then(function (res) {
          Object.assign(createdMessage1, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
        });
      });
      // failing here
      it('should return bad request if required fields are not presents', function () {
        var message3 = {
          title: 'Apologise',
          message: '',
          senderId: _signupTest.regularUser1.id,
          receiverId: _signupTest.adminUser.id
        };
        return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message3).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not create a message for a sender that does not exist', function () {
        return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message4).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });

      it('should not create a message if no message is posted', function () {
        return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message5).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
      });
    });

    describe('get messages', function () {
      it('should return all messages for the given userId', function () {
        return _chai2.default.request(app).get('/api/v1/contacts?userId=' + _signupTest.regularUser1.id).set('token', signedInUser.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
        });
      });

      it('should return an empty array if no message exist for the given userId', function () {
        return _chai2.default.request(app).get('/api/v1/contacts')
        // regularuser2 does not have any messages
        .set('token', _signupTest.regularUser2.token).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
        });
      });
    });
  });

  describe('admin messages', function () {
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

    describe('admin reply messages', function () {
      it('admin should be able to reply a message', function () {
        var adminMessage = {
          title: 'Apologise',
          message: 'Please we will attend to it right away',
          receiverId: _signupTest.regularUser1.id,
          senderId: _signupTest.adminUser.id
        };
        return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(adminMessage).then(function (res) {
          Object.assign(createdMessage2, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
        });
      });
    });
    // failing here
    it('should return bad request if required fields are not presents', function () {
      var message3 = {
        title: 'Apologise',
        message: '',
        receiverId: _signupTest.regularUser1.id,
        senderId: _signupTest.adminUser.id
      };
      return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message3).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
      });
    });

    it('should not create a message for a sender that does not exist', function () {
      return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message4).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
      });
    });

    it('should not create a message if no message is posted', function () {
      return _chai2.default.request(app).post('/api/v1/contacts').set('token', signedInUser.token).send(message5).then(function (res) {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
      });
    });
  });

  describe('admin get message', function () {
    it('should return all messages if isAdmin === true', function () {
      return _chai2.default.request(app).get('/api/v1/contacts?isAdmin=true').set('token', signedInUser.token).then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
      });
    });
  });
});
//# sourceMappingURL=contactTest.js.map