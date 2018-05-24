import client from './connection';

const queryArray = [
  `create table users (
    id serial not null primary key,
    fullname varchar (40) not null,
    imgUrl varchar (100),
    email varchar  (40) not null,
    phone varchar (20),
    address varchar (20) not null,
    username varchar (20) not null unique,
    password  varchar (40) not null,
    isAdmin boolean,
    serviceName varchar (50) not null
  )
  `,
  `create table requests (
    id serial not null primary key,
    category varchar (40) not null,
    description text not null,
    address varchar (20) not null,
    username varchar (20) not null unique,
    status varchar(10) not null,
    serviceName varchar (50) not null,
    userId int not null,
    updatedAt timestamp
  )`,
  `  create table contacts (
    id serial not null primary key,
    title varchar (40),
    message text not null,
    userId int not null,
    adminId int not null,
    senderId int not null
  );
`,
];

/* eslint-disable no-console */
queryArray.forEach(queryString => {
  console.log('creating table');
  client.query(queryString)
    .then(() => console.log('table created'))
    .catch(error => console.log(error));
});
