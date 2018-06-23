import models from './../models/index';
import { handleResponse } from './../services/services';

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
              handleResponse(res, 201, newMessage);
            })
            .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
        }
        return handleResponse(res, 404, 'Your identity could not be verified. Please make sure you are logged in');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }

  static getMessages(req, res) {
    const userId = parseInt(req.body.decode.id, 10);
    return contacts
      .findAll({
        where: {
          senderId: userId,
          receiverId: userId,
        },
        type: 'or',
      })
      .then((messages) => { 
        if (messages) {
          // no messages has been send or received
          if (messages.length === 0) {
            return handleResponse(res, 200, []);
          }
          const clientsInfo = [];
          messages.forEach((message) => {
            // object to hold message sender and receiver
            const messageObj = {};
            messageObj.message = message;

            // get info of message sender
            return users
              .getClient(message.senderId)
              .then((sender) => {
                return sender;
              })
              .then(sender => {
                if (sender) {
                  messageObj.sender = sender;
                } else {
                  messageObj.sender = { message: 'user not found' };
                }
              })
              .then(() => {
                // get info of message receiver
                return users
                  .getClient(message.receiverId)
                  .then((receiver) => {
                    return receiver;
                  })
                  .then(receiver => {
                    if (receiver) {
                      messageObj.receiver = receiver;
                    } else {
                      messageObj.receiver = { message: 'user not found' };
                    }

                    // push messageObj to collection
                    clientsInfo.push(messageObj);
                    if (clientsInfo.length === messages.length) {
                      return handleResponse(res, 200, clientsInfo);
                    }
                  })
              })
          });
        }
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }
};

export default ContactController;
