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
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 1,
  status: 'pending'
};
var request2 = {
  category: 'electrical',
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 2,
  status: 'pending'
};

var request3 = {
  category: 'electrical',
  description: 'Socket  burned',
  urgency: 'urgent',
  department: 'baking',
  userId: 4,
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
var createdRequest1 = {};
var createdRequest2 = {};
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

    describe('Empty request model', function () {
      it('should return an empty array', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests').then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('should return not found for the request id', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests/1').then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
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
      it('should return a request with the given id', function () {
        var id = createdRequest1.id;

        return _chai2.default.request(app).get('/api/v1/users/requests/' + id).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.any.keys('userId');
        });
      });

      it('should return not found for the request that does not exist', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests/5').then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'request not found' });
        });
      });

      it('should return 400 error for bad request', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests/0').then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });

    // test for get ../users/requests
    describe('get all request', function () {
      it('should return all request', function () {
        return _chai2.default.request(app).get('/api/v1/users/requests').then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(2);
          expect(res.body).to.deep.include.members([createdRequest1, createdRequest2]);
        });
      });
    });

    // test for put ../users/requests/:requestId
    describe('update request', function () {
      it('should update a request', function () {
        var id = createdRequest1.id;

        return _chai2.default.request(app).put('/api/v1/users/requests/' + id).send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('approved');
        });
      });

      it('should return not found request that does not exist', function () {
        return _chai2.default.request(app).put('/api/v1/users/requests/4').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
      });

      it('should return bad request if requestId is not specified params', function () {
        return _chai2.default.request(app).put('/api/v1/users/requests/0').send({
          status: 'approved'
        }).then(function (res) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
      });
    });
  });
}
//# sourceMappingURL=endpointTests.js.map