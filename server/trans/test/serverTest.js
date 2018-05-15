'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _app2.default();
var expect = _chai2.default.expect;

_chai2.default.use(_chaiHttp2.default);

// enforce test to run only in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log('can\'t run test in non test env. you are in ' + process.env.NODE_ENV + ' environment');
} else {
  describe('Server', function () {
    describe('unit test', function () {
      it('should export a function', function () {
        expect(_app2.default).to.be.a('function');
      });
      it('should to be an object', function () {
        expect(server).to.be.a('Object');
      });

      it('server should be an instanceOf Server', function () {
        expect(server).to.be.an.instanceOf(_app2.default);
      });
    });
  });
}
//# sourceMappingURL=serverTest.js.map