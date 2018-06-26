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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);

exports.default = describe('get services controller', function () {
  it('should return info about service providers', function () {
    return _chai2.default.request(_app2.default).get('/api/v1/auth/services').then(function (res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length.of.at.least(1);
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('serviceName');
      expect(res.body[0]).to.have.property('phone');
    });
  });
});
//# sourceMappingURL=getServiceTest.js.map