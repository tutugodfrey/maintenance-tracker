import client from './connection';

const queryString = `create table users (
  id serial not null primary key,
  fullname varchar (40) not null,
  imgUrl varchar (100),
  email varchar  (40) not null,
  phone varchar (20),
  address varchar (70) not null,
  username varchar (20) not null unique,
  password  varchar (700) not null,
  isAdmin boolean,
  serviceName varchar (50) not null
);
create table requests (
  id serial not null primary key,
  issueDate date not null,
  category varchar (50) not null,
  description text not null,
  address varchar (100) not null,
  urgent boolean,
  status varchar(30) not null,
  adminId int not null,
  userId int not null,
  updatedAt date
);
 create table contacts (
  id serial not null primary key,
  title varchar (40),
  message text not null,
  receiverId int not null,
  senderId int not null
);
`;
/* eslint-disable no-console */
console.log('creating tables');
client.query(queryString)
  .then(() => {
    console.log('table created');
    client.end();
  })
  .catch((error) => {
    console.log(error);
    client.end();
  });

