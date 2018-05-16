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
          expect(res.body).to.eql({ 'Error': 'request not found' });
        });
      });
    });
  });
}
//# sourceMappingURL=endpointTests.js.map