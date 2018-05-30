'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _app = require('./../app');

var _app2 = _interopRequireDefault(_app);

var _connection = require('./../models/connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _app2.default();
var expect = _chai2.default.expect;
exports.default = describe('Server', function () {
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
//# sourceMappingURL=serverTest.js.map