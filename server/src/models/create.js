import client from './connection';

const queryString =   `create table users (
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
  category varchar (50) not null,
  description text not null,
  address varchar (100) not null,
  status varchar(30) not null,
  serviceName varchar (50),
  userId int not null,
  urgent boolean,
  issueDate date not null,
  updatedAt date
);
 create table contacts (
  id serial not null primary key,
  title varchar (40),
  message text not null,
  userId int not null,
  adminId int not null,
  senderId int not null
);
`

client.query(queryString)
.then(() => {
  console.log('table created')
  client.end()
})
.catch(error =>{
   console.log(error)
   client.end();
});



