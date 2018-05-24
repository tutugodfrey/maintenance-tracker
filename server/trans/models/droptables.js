'use strict';

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var queryArray = ['drop table if exists users', 'drop table if exists requests', 'drop table if exists contact'];
queryArray.forEach(function (queryString) {
  console.log('droping table');
  _connection2.default.query(queryString).then(function () {
    return console.log('table droped');
  }).catch(function (error) {
    return console.log(error);
  });
});
//# sourceMappingURL=droptables.js.map