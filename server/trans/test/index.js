'use strict';

var _serverTest = require('./serverTest');

var _serverTest2 = _interopRequireDefault(_serverTest);

var _signupTest = require('./signupTest');

var _signupTest2 = _interopRequireDefault(_signupTest);

var _connection = require('./../models/connection');

var _connection2 = _interopRequireDefault(_connection);

var _userRequestTest = require('./userRequestTest');

var _userRequestTest2 = _interopRequireDefault(_userRequestTest);

var _adminTest = require('./adminTest');

var _adminTest2 = _interopRequireDefault(_adminTest);

var _contactTest = require('./contactTest');

var _contactTest2 = _interopRequireDefault(_contactTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// enforce test to run only in test env

// import modelTest from './dummyDataTest';
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log('can\'t run test in non test env. you are in ' + process.env.NODE_ENV + ' environment');
} else {
  _serverTest2.default;
  /*  modelTest; */
  _signupTest2.default;
  _signupTest2.default;
  _userRequestTest2.default;
  _adminTest2.default;
  _contactTest2.default;
}
//# sourceMappingURL=index.js.map