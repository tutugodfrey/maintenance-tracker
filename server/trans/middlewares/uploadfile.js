'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usersUpload = undefined;

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UsersStorage = _multer2.default.diskStorage({
  destination: './public/users-photo/',
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});
var usersUpload = (0, _multer2.default)({ storage: UsersStorage });
exports.usersUpload = usersUpload;
//# sourceMappingURL=uploadfile.js.map