import models from './../models/index';

const { users, contacts } = models;
const ContactController = class {
  // create a new message
  static addMessage(req, res) {
    const {
      userId,
      senderId,
      adminId,
      title,
      message,
    } = req.body;
    if (!parseInt(userId, 10) || !parseInt(adminId, 10) || !parseInt(senderId, 10)) {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (message.trim() === '' || title.trim() === '') {
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
            title,
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
