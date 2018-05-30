'use strict';

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryString = 'create table users (\n  id serial not null primary key,\n  fullname varchar (40) not null,\n  imgUrl varchar (100),\n  email varchar  (40) not null,\n  phone varchar (20),\n  address varchar (70) not null,\n  username varchar (20) not null unique,\n  password  varchar (700) not null,\n  isAdmin boolean,\n  serviceName varchar (50) not null\n);\ncreate table requests (\n  id serial not null primary key,\n  category varchar (50) not null,\n  description text not null,\n  address varchar (100) not null,\n  status varchar(30) not null,\n  serviceName varchar (50),\n  userId int not null,\n  urgent boolean,\n  issueDate date not null,\n  updatedAt date\n);\n create table contacts (\n  id serial not null primary key,\n  title varchar (40),\n  message text not null,\n  userId int not null,\n  adminId int not null,\n  senderId int not null\n);\n';

_connection2.default.query(queryString).then(function () {
  console.log('table created');
  _connection2.default.end();
}).catch(function (error) {
  console.log(error);
  _connection2.default.end();
});
//# sourceMappingURL=create.js.map