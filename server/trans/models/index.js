'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DummyDataModel = require('./DummyDataModel');

var _DummyDataModel2 = _interopRequireDefault(_DummyDataModel);

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requests = new _DummyDataModel2.default('requests', ['id'], ['category', 'description', 'userId']);
var contacts = new _DummyDataModel2.default('contacts', ['id'], ['message', 'userId', 'adminId', 'senderId']);
var users = new _DummyDataModel2.default('users', ['id', 'username', 'email']);

exports.default = {
  requests: requests,
  contacts: contacts,
  users: users
};
//# sourceMappingURL=index.js.map