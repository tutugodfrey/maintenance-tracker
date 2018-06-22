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

/* eslint-disable no-mutable-exports */
_dotenvSafe2.default.config();
var env = process.env.NODE_ENV || 'development';
var connectionString = void 0;
if (_config2.default[env]) {
  var databaseURL = _config2.default[env].use_env_variable;
  if (process.env.NODE_ENC !== 'production') {
    /* eslint-disable no-console */
    console.log(databaseURL);
  }
  connectionString = process.env[databaseURL];
}
var client = new _pg.Client(connectionString);
client.connect();
exports.default = client;
//# sourceMappingURL=connection.js.map