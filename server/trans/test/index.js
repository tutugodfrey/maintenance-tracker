'use strict';

var _serverTest = require('./serverTest');

var _serverTest2 = _interopRequireDefault(_serverTest);

var _dummyDataTest = require('./dummyDataTest');

var _dummyDataTest2 = _interopRequireDefault(_dummyDataTest);

var _signupTest = require('./signupTest');

var _signupTest2 = _interopRequireDefault(_signupTest);

var _signinTest = require('./signinTest');

var _signinTest2 = _interopRequireDefault(_signinTest);

var _userRequestTest = require('./userRequestTest');

var _userRequestTest2 = _interopRequireDefault(_userRequestTest);

var _adminTest = require('./adminTest');

var _adminTest2 = _interopRequireDefault(_adminTest);

var _contactTest = require('./contactTest');

var _contactTest2 = _interopRequireDefault(_contactTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// enforce test to run only in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log('can\'t run test in non test env. you are in ' + process.env.NODE_ENV + ' environment');
} else {
  /* eslint-disable no-unused-expressions */
  _serverTest2.default;
  _dummyDataTest2.default;
  _signupTest2.default;
  _signinTest2.default;
  _userRequestTest2.default;
  _adminTest2.default;
  _contactTest2.default;
}
//# sourceMappingURL=index.js.map