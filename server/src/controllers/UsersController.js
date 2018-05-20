import models from './../models/index';

const { users } = models;
const UsersController = class {
  // create a new user account
  static signup(req, res) {
    return res.send(users);
  }
};

export default UsersController;
