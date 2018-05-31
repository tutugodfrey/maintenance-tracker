export default {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
  staging: {
    use_env_variable: 'STAGE_DATABASE_URL',
  },
};
