import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from './../models/index';
import { handleResponse } from './../services/services';

dotenv.config();

const { users } = models;
const UsersController = class {
  // create a new user account
  static signup(req, res) {
    const {
      fullname,
      username,
      email,
      address,
      phone,
      password,
      confirmPassword,
      isAdmin,
      serviceName,
      imgUrl,
    } = req.body;

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
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);
          return users
            .create({
              fullname,
              email,
              username,
              address,
              serviceName,
              phone,
              imgUrl,
              password: hashedPassword,
              isAdmin: Boolean(isAdmin) || false,
            })
            .then((createdUser) => {
              const authenKeys = {
                fullname: createdUser.fullname,
                email: createdUser.email,
                username: createdUser.username,
                phone: createdUser.phone,
                imgUrl: createdUser.imgUrl,
                id: createdUser.id,
                isAdmin: createdUser.isAdmin,
                serviceName: createdUser.serviceName,
              };
              const token = jwt.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
              handleResponse(res, 201, {
                token,
                fullname: createdUser.fullname,
                email: createdUser.email,
                username: createdUser.username,
                imgUrl: createdUser.imgUrl,
                id: createdUser.id,
                isAdmin: createdUser.isAdmin,
                serviceName: createdUser.serviceName,
              })
            })
            .catch(() => handleResponse(res, 500, 'something went wrong! try again later'));
        }
        return handleResponse(res, 409, 'user already exist');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong! try again later'));
  }

  // signin controller
  static signin(req, res) {
    const {
      username,
      password,
    } = req.body;

    return users
      .find({
        where: {
          username,
        },
      })
      .then((user) => {
        if (user) {
          let passwordConfirmed = false;
          const hashedPassword = user.password;
          passwordConfirmed = bcrypt.compareSync(password, hashedPassword);
          if (passwordConfirmed) {
            const authenKeys = {
              username: user.username,
              fullname: user.fullname,
              isAdmin: user.isAdmin,
              id: user.id,
              imgUrl: user.imgUrl,
              serviceName: user.serviceName,
            };
            const token = jwt.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
            return handleResponse(res, 200, {
              token,
              fullname: user.fullname,
              email: user.email,
              username: user.username,
              imgUrl: user.imgUrl,
              id: user.id,
              isAdmin: user.isAdmin,
              serviceName: user.serviceName,
            });
          }
            return handleResponse(res, 401, 'authentication fail! check your username or password');
        } 
          return handleResponse(res, 401, 'authentication fail! check your username or password');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong! try again later'));
  }

  static getServiceName(req, res) {
    return users
      .findServiceName()
      .then((serviceNames) => {
        if (serviceNames) {
          return handleResponse(res, 200, serviceNames);
        }
        return handleResponse(res, 404, 'service not avialable yet');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong! try again later'));
  }
};

export default UsersController;
