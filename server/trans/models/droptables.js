'use strict';

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var queryString = 'drop table if exists users; drop table if exists requests; drop table if exists contacts';

// let queryCompleted = false;
console.log('droping table');
_connection2.default.query(queryString).then(function () {
  console.log('table droped');
  _connection2.default.end();
}).catch(function (error) {
  console.log(error);
  _connection2.default.end();
});
//# sourceMappingURL=droptables.js.map