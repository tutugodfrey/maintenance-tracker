'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// const Services = class {
var getImgUrl = exports.getImgUrl = function getImgUrl(path) {
  if (typeof path !== 'string') {
    return 'expected a string as argument';
  }
  var newPath = path.replace(/\\/g, '/');
  if (newPath.indexOf('/') < 0) {
    return 'Cant resolve path ' + newPath;
  }
  var indexOfPublic = newPath.indexOf('/');
  var relPath = newPath.substr(indexOfPublic, newPath.length);
  return relPath;
};

var handleResponse = exports.handleResponse = function handleResponse(res, statusCode, message) {
  if (typeof message !== 'string') {
    return res.status(statusCode).send(message);
  }
  return res.status(statusCode).send({ message: message });
};
//# sourceMappingURL=Services.js.map