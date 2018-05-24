'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL'
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
//# sourceMappingURL=config.js.map