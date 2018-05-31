import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from './../models/index';
import Services from './../helpers/Services';

dotenv.config();

const { users } = models;
const UsersController = class {
  // create a new user account
  static signup(req, res) {
    const {
      fullname,
      username,
      email,
      phone,
      address,
      serviceName,
      password,
      confirmPassword,
      isAdmin,
    } = req.body;
    // validate input
    if (username.trim() === '' || fullname.trim() === '' || email.trim() === ''
    || password.trim() === '' || confirmPassword.trim() === '') {
      return res.status(400).send({ message: 'missing required field' });
    }
    const emailRegExp = /\w+@\w+\.(net|com|org)/;
    if (!email.match(emailRegExp)) {
      return res.status(400).send({ message: 'typeError: invalid email format' });
    }

    if (password.length < 6 || confirmPassword.length < 6) {
      return res.status(400).send({ message: 'length of password must not be less than 6' });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'password does not match' });
    }

    if (address.trim() === '') {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (!isAdmin && isAdmin.trim() !== '') {
      return res.status(400).send({ message: 'isAdmin must be a true or false' });
    }
    // console.log(req.body)
    if (!req.file) {
      return users
        .find({
          where: {
            username,
            email,
          },
        })
        .then((user) => {
          if (!user) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (hashErr, hash) => {
                users
                  .create({
                    fullname,
                    email,
                    username,
                    address,
                    serviceName,
                    password,
                    isAdmin: isAdmin || false,
                    imgUrl: 'no/file/uploaded',
                  })
                  .then((signup) => {
                    console.log(signup)
                    const authenKeys = {
                      fullname: signup.fullname,
                      email: signup.email,
                      username: signup.username,
                      imgUrl: signup.imgUrl,
                      id: signup.id,
                      isAdmin: signup.isadmin,
                    };
                    const token = jwt.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
                    res.status(201).send({
                      token,
                      message: 'signup successful',
                      email: signup.email,
                      username: signup.username,
                      imgUrl: signup.imgurl,
                      id: signup.id,
                      isAdmin: signup.isadmin,
                    });
                  })
                  .catch(error => res.status(400).send({ error }));
              });
            });
          } else {
            res.status(409).send({ message: 'user already exist' });
          }
        })
        .catch(error => res.status(500).send(error));
    }
    return users
      .find({
        where: {
          username,
          email,
        },
        type: 'or',
      })
      .then((user) => {
        if (!user) {
          // handle uploaded profile pix
          const destination = Services.getImgUrl(req.file.path);
          // const passwd2 = req.body.passwd2;
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (hashErr, hash) => {
                users
                  .create({
                    fullname,
                    email,
                    username,
                    address,
                    isAdmin,
                    serviceName,
                    phone,
                    imgUrl: destination,
                    password: hash,
                  })
                  .then((signup) => {
                    console.log(signup)
                    const authenKeys = {
                      fullname: signup.fullname,
                      email: signup.email,
                      username: signup.username,
                      imgUrl: signup.imgurl,
                      id: signup.id,
                      isAdmin: signup.isadmin,
                    };
                    const token = jwt.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
                    res.status(201).send({
                      token,
                      message: 'signup successful',
                      fullname: signup.fullname,
                      email: signup.email,
                      username: signup.username,
                      imgUrl: signup.imgUrl,
                      id: signup.id,
                      isAdmin: signup.isAdmin,
                    });
                  })
                  .catch(error => res.status(400).send({ error }));
              });
            });
        } else {
          res.status(409).send({ message: 'user already exist' });
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
            const authenKeys = {
              username: user.username,
              fullname: user.fullname,
              isAdmin: user.isAdmin,
              userId: user.id,
              imgUrl: user.imgUrl,
            };
            const token = jwt.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
            res.status(200).send({
              token,
              success: true,
              username: user.username,
              fullname: user.fullname,
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

  static getServiceName(req, res) {
    return requests
      .findServiceName()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(500).send(error));
  }

};

export default UsersController;
