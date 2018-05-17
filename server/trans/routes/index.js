'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RequestController = require('./../controllers/RequestController');

var _RequestController2 = _interopRequireDefault(_RequestController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requestController = new _RequestController2.default();
var Routes = function () {
  function Routes() {
    _classCallCheck(this, Routes);

    this.requestController = requestController;
  }
  /* eslint-disable class-methods-use-this */


  _createClass(Routes, [{
    key: 'routes',
    value: function routes(app) {
      app.get('/', function (req, res) {
        res.status(200).send({ message: 'welcome to the maintenance trackers' });
      });

      app.post('/api/v1/users/requests', this.requestController.addRequest);
      app.get('/api/v1/users/requests/:requestId', this.requestController.getOneRequest);
      app.get('/api/v1/users/requests', this.requestController.getAllRequests);
      app.put('/api/v1/users/requests/:requestId', this.requestController.updateRequest);
    }
  }]);

  return Routes;
}();

exports.default = Routes;
//# sourceMappingURL=index.js.map