'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DummyDataModel = require('./DummyDataModel');

var _DummyDataModel2 = _interopRequireDefault(_DummyDataModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requests = new _DummyDataModel2.default('requests', ['id'], ['category', 'description', 'userId']);
var contacts = new _DummyDataModel2.default('contacts', ['id'], ['message', 'userId', 'adminId']);
var users = new _DummyDataModel2.default('users', ['id', 'username', 'email']);
users.bulkCreate([{
  username: 'foo',
  email: 'foo@somebody.com',
  isAdmin: true
}, {
  username: 'janed',
  email: 'janed@somebody.com'
}, {
  username: 'alice',
  email: 'alice@somebody.com'
}]);

exports.default = {
  requests: requests,
  contacts: contacts,
  users: users
};
//# sourceMappingURL=index.js.map