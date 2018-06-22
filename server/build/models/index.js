'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataModel = require('./DataModel');

var _DataModel2 = _interopRequireDefault(_DataModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requests = new _DataModel2.default('requests');
var contacts = new _DataModel2.default('contacts');
var users = new _DataModel2.default('users');

exports.default = {
  requests: requests,
  contacts: contacts,
  users: users
};
//# sourceMappingURL=index.js.map