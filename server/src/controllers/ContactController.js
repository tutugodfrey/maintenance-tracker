import models from './../models/index';

const ContactController = class {
  // create a new message
  static addMessage(req, res) {
    res.send(models);
  }
};

export default ContactController;
