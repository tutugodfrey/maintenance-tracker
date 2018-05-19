import models from './../models/index';

const { users, contacts } = models;
const ContactController = class {
  // create a new message
  static addMessage(req, res) {
    const userId = parseInt(req.body.userId, 10);
    const adminId = parseInt(req.body.adminId, 10);
    if (!userId || !adminId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return users
      .findById(userId)
      .then((user) => {
        return contacts
          .create({
            userId,
            adminId,
            title: req.body.title,
            message: req.body.message,
            sender: req.body.sender,
          })
          .then((message) => {
            res.status(201).send({
              message,
              user,
            });
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(404).send(error));
  }
};

export default ContactController;
