import models from './../models/index';

const { users, contacts } = models;
const ContactController = class {
  // create a new message
  static addMessage(req, res) {
    const userId = parseInt(req.body.userId, 10);
    const adminId = parseInt(req.body.adminId, 10);
    const senderId = parseInt(req.body.senderId, 10);
    const message = req.body.message.trim();
    if (!userId || !adminId || !senderId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return users
      .findById(senderId)
      .then((user) => {
        return contacts
          .create({
            userId,
            adminId,
            senderId,
            message,
            title: req.body.title,
          })
          .then((newMessage) => {
            res.status(201).send({
              newMessage,
              user,
            });
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(404).send(error));
  }

  static getMessages(req, res) {
    const userId = parseInt(req.query.userId, 10);
    const { isAdmin } = req.query;
    if (!(userId || isAdmin)) {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (isAdmin === 'true') {
      return contacts
        .findAll()
        .then(messages => res.status(200).send(messages))
        .catch(error => res.status(500).send(error));
    }
    return contacts
      .findAll({
        where: {
          userId,
        },
      })
      .then(messages => res.status(200).send(messages))
      .catch(error => res.status(500).send(error));
  }
};

export default ContactController;
