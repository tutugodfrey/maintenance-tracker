'use strict';

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryArray = ['create table users (\n    id serial not null primary key,\n    fullname varchar (40) not null,\n    imgUrl varchar (100),\n    email varchar  (40) not null,\n    phone varchar (20),\n    address varchar (20) not null,\n    username varchar (20) not null unique,\n    password  varchar (40) not null,\n    isAdmin boolean,\n    serviceName varchar (50) not null\n  )\n  ', 'create table requests (\n    id serial not null primary key,\n    category varchar (40) not null,\n    description text not null,\n    address varchar (20) not null,\n    username varchar (20) not null unique,\n    status varchar(10) not null,\n    serviceName varchar (50) not null,\n    userId int not null,\n    updatedAt timestamp\n  )', '  create table contacts (\n    id serial not null primary key,\n    title varchar (40),\n    message text not null,\n    userId int not null,\n    adminId int not null,\n    senderId int not null\n  );\n'];

/* eslint-disable no-console */
queryArray.forEach(function (queryString) {
  console.log('creating table');
  _connection2.default.query(queryString).then(function () {
    return console.log('table created');
  }).catch(function (error) {
    return console.log(error);
  });
});
//# sourceMappingURL=create.js.map