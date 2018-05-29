'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _dotenvSafe = require('dotenv-safe');

var _dotenvSafe2 = _interopRequireDefault(_dotenvSafe);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/no-mutable-export */
_dotenvSafe2.default.config();
var env = process.env.NODE_ENV || 'test';
var client = void 0;
if (_config2.default[env]) {
  var databaseURL = _config2.default[env].use_env_variable;
  console.log(databaseURL);
  var connectionString = process.env[databaseURL];
  client = new _pg.Client(connectionString);
  client.connect();
}

exports.default = client;
//# sourceMappingURL=connection.js.map