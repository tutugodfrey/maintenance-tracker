'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RequestController = require('./../controllers/RequestController');

var _RequestController2 = _interopRequireDefault(_RequestController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const requestController = new RequestController();
var Routes = function () {
  function Routes() {
    _classCallCheck(this, Routes);

    this.RequestController = _RequestController2.default;
  }
  /* eslint-disable class-methods-use-thiss */


  _createClass(Routes, [{
    key: 'routes',
    value: function routes(app) {
      app.get('/', function (req, res) {
        res.status(200).send({ message: 'welcome to the maintenance trackers' });
      });

      app.post('/api/v1/users/requests', this.RequestController.addRequest);
      app.get('/api/v1/users/requests/:requestId', this.RequestController.getOneRequest);
      app.get('/api/v1/users/requests', this.RequestController.getAllRequests);
      app.put('/api/v1/users/requests/:requestId', this.RequestController.updateRequest);
      app.delete('/api/v1/users/requests/:requestId', this.RequestController.deleteRequest);
    }
  }]);

  return Routes;
}();

exports.default = Routes;
//# sourceMappingURL=index.js.map