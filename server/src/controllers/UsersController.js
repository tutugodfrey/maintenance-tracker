import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from './../models/index';
import HelperFuncts from './../helpers/HelperFuncts';

dotenv.config();
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
        .then(() => {
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
                  .catch(() => res.status(400).send({ message: 'user already exist' }));
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
      .then(() => {
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
                    isAdmin: signup.isAdmin,
                  });
                })
                .catch(() => res.status(400).send({ message: 'user already exist' }));
            });
          });
        } else {
          // password match fail
          res.status(400).send({ message: 'password does not match' });
        }
      })
      .catch(error => res.status(500).send(error));
  }

  // signin controller
  static signin(req, res) {
    return users
      .find({
        where: {
          username: req.body.username,
        },
      })
      .then((user) => {
        if (user) {
          let passwordConfirmed = false;
          const hashedPassword = user.password;
          const { password } = req.body;
          passwordConfirmed = bcrypt.compareSync(password, hashedPassword);
          if (passwordConfirmed) {
            const authenKey = user.username;
            const token = jwt.sign({ authenKey }, process.env.SECRET_KEY, { expiresIn: '48h' });
            res.status(200).send({
              token,
              success: true,
              username: user.username,
              isAdmin: user.isAdmin,
              userId: user.id,
              imgUrl: user.imgUrl,
            });
          } else {
            res.status(400).send({ message: 'authentication fail! check your username or password' });
          }
        } else {
          res.status(400).send({ message: 'authentication fail! check your username or password' });
        }
      })
      .catch(error => res.status(400).send(error));
  }
};

export default UsersController;
