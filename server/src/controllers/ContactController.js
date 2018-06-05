import models from './../models/index';

const { users, contacts } = models;
const ContactController = class {
  // create a new message
  static addMessage(req, res) {
    const {
      receiverId,
      title,
      message,
    } = req.body;

    // sender is user with token
    const senderId = req.body.decode.id;
    if (!parseInt(senderId, 10)) {
      return res.status(400).send({ message: 'you are authorized to perform this action. please make sure you are logged in' });
    }
    if (!parseInt(receiverId, 10)) {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (message.trim() === '' || title.trim() === '') {
      return res.status(400).send({ message: 'missing required field' });
    }
    return users
      .findById(senderId)
      .then((user) => {
        if (user) {
          return contacts
            .create({
              receiverId,
              senderId,
              message,
              title,
            })
            .then((newMessage) => {
              res.status(201).send(newMessage);
            })
            .catch(error => res.status(400).send(error));
        }
        return res.status(201).send({ messag: 'Your identity could not be verified. Please make sure you are logged in' });
      })
      .catch(error => res.status(404).send(error));
  }

  static getMessages(req, res) {
    const userId = parseInt(req.body.decode.id, 10);
    const { isAdmin } = req.body.decode;
    if (!(userId || isAdmin)) {
      return res.status(400).send({ message: 'you are not authorized to perform this action. please make sure you are logged in' });
    }
    return contacts
      .findAll({
        where: {
          senderId: userId,
          receiverId: userId,
        },
        type: 'or',
      })
      .then(messages => res.status(200).send(messages))
      .catch(error => res.status(500).send(error));
  }
};

export default ContactController;
