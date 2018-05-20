import models from './../models/index';

const { users } = models;
const UsersController = class {
  // create a new user account
  static signup(req, res) {
    return
    users.create({
      
    })
  }
};

export default UsersController;
