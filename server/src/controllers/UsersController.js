import bcrypt from 'bcrypt';
import models from './../models/index';
import HelperFuncts from './../helpers/HelperFuncts';

const { users } = models;
const UsersController = class {
  // create a new user account
  static signup(req, res) {
    if (!req.file) {
      return users
        .findAll({
          where: {
            username: req.body.username,
            email: req.body.email,
          },
        })
        .then((user) => {
          if (user.length > 0) {
            // username already exist
            res.status(200).send({ message: 'user already exist' });
          }
          const { passwd1, passwd2 } = req.body;
          let passwd;
          if (passwd1 === passwd2) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(passwd1, salt, (hashErr, hash) => {
                passwd = hash;
                users
                  .create({
                    password: passwd,
                    fullname: req.body.fullname,
                    email: req.body.email,
                    username: req.body.username,
                    imgUrl: 'no/file/uploaded',
                    address: req.body.address,
                    isAdmin: req.body.isAdmin,
                    serviceName: req.body.serviceName,
                  })
                  .then((signup) => {
                    res.status(201).send({
                      message: 'signup successful',
                      fullname: signup.fullname,
                      email: signup.email,
                      username: signup.username,
                      imgUrl: signup.imgUrl,
                      id: signup.id,
                    });
                  })
                  .catch(error => res.status(400).send(error));
              });
            });
          } else {
            // password match fail
            res.status(400).send({ message: 'password does not match' });
          }
        })
        .catch(error => res.status(500).send(error));
    }
    return users
      .findAll({
        where: {
          username: req.body.username,
          email: req.body.email,
        },
      })
      .then((user) => {
        if (user.length > 0) {
          // username already exist
          res.status(200).send({ message: 'user already exist' });
        }
        // handle uploaded profile pix
        const destination = HelperFuncts.getImgUrl(req.file.path);
        const { passwd1, passwd2 } = req.body;
        // const passwd2 = req.body.passwd2;
        let passwd;
        if (passwd1 === passwd2) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(passwd1, salt, (hashErr, hash) => {
              passwd = hash;
              users
                .create({
                  password: passwd,
                  fullname: req.body.fullname,
                  email: req.body.email,
                  username: req.body.username,
                  imgUrl: destination,
                  address: req.body.address,
                  isAdmin: req.body.isAdmin,
                  serviceName: req.body.serviceName,
                })
                .then((signup) => {
                  res.status(201).send({
                    message: 'signup successful',
                    fullname: signup.fullname,
                    email: signup.email,
                    username: signup.username,
                    imgUrl: signup.imgUrl,
                    id: signup.id,
                  });
                })
                .catch(error => res.status(400).send(error));
            });
          });
        } else {
          // password match fail
          res.status(400).send({ message: 'password does not match' });
        }
      })
      .catch(error => res.status(500).send(error));
  }
};

export default UsersController;
