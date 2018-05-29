# maintenance-tracker
---

Maintenance tracker is a platform that allows users to reach out to maintenance department to request repairs/ maintenance. Users can keep track the progress of their requests via the status which may be one of Pending, Approved, Rejected, Resolved. Users should also be able to contact the service department if need be to clarify the status of thier request. Admin should be able to view all request from users and reject or approve the request. After the Operation department must have resolved a request the admin should be able to mark the request as resolved and notify the users of the update.

## Contents

* Status
* Starting the application
* Testing
* Route table
* Docs and Links
* Author and Contributors

### Status

[![Build Status](https://www.travis-ci.org/tutugodfrey/maintenance-tracker.svg?branch=feature%2Fserver)](https://www.travis-ci.org/tutugodfrey/maintenance-tracker)
<a href="https://codeclimate.com/github/tutugodfrey/maintenance-tracker/maintainability"><img src="https://api.codeclimate.com/v1/badges/0f04e7782f92cbed6f5f/maintainability" /></a>
<a href="https://codeclimate.com/github/tutugodfrey/maintenance-tracker/test_coverage"><img src="https://api.codeclimate.com/v1/badges/0f04e7782f92cbed6f5f/test_coverage" /></a>
[![Coverage Status](https://coveralls.io/repos/github/tutugodfrey/maintenance-tracker/badge.svg?branch=157581278-chores%2FciIntegrations)](https://coveralls.io/github/tutugodfrey/maintenance-tracker?branch=157581278-chores%2FciIntegrations)

---

### Starting the application

Clone the repository `git clone https://github.com/tutugodfrey/maintenance-tracker.git`

cd maintenance-tracker

Run `npm install` to install dependencies

Running `npm run start:dev` will start the application in development. In this case the application is being serve from the src/ files with babel-node and nodemon to watch for file changes. Before pushing to source control (github), or testing with travis ensure you 
run `npm run build` to transpile the source file to es6 and above. Transpilation will build source files into trans/ directory for production and testing with continous integration platform.
To start the application in production mode run `npm start` which will serve the application from the trans/ directory
Routing table
---

### Testing

There are two modes to run test locally, `npm run test:local` and `npm test`. `npm run test:local` will transpile source code to es5 from src/ to trans/ directory and then run the test which is served from the trans/ directory. `npm test` will run the test directly from the trans/ directory skipping the transpiling stage. You will probably want to use the latter command if no changes has been made in src/ since last transpilation, thus conserving the time use for transpiling.
NOTE: ensure you are in test environment before running test. run `export NODE_ENV=test` or `set NODE_ENV=test` depending on whether you are using bash or window cmd.

---

### Route table

|                    Paths                     |          Methods          |                                     Actions                              |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| /                                            |  GET                      |  Application default route                                               |
| /api/v1/auth/signup                          |  POST                     |  user signup                                                             |
| /api/v1/auth/signin                          |  POST                     |  user signin                                                             |
|                                              |                           |                                                                          |
| /api/v1/users/requests                       |  POST                     |  Create a new request                                                    |
| /api/v1/users/requests                       |  GET                      |  get all requests                                                        |
| /api/v1/users/requests/:requestId            |  GET                      |  get one request                                                         |
| /api/v1/users/requests/:requestId            |  PUT                      |  update a request                                                        |
|                                              |                           |                                                                          |
| /api/v1/users/request/:requestId             |  DELETE                   |  delete a request                                                        |
| /api/v1/requests                             |  GET                      |  admin get all requests                                                  |
| /api/v1/requests/:requestId/disapprove       |  PUT                      |  admin can disapprove a request                                          |
| /api/v1/requests/:requestId/approve          |  PUT                      |  admin can approve a request                                             |
| /api/v1/requests/:requestId/resolve          |  PUT                      |  admin can mark a request as resolve                                     |
|                                              |                           |                                                                          |
| /api/v1/contacts                             |  POST                     |  send a message                                                          |
| /api/v1/contacts                             |  GET                      |  get all messages                                                        | 

---

### Docs and Links

[view project template](https://tutugodfrey.github.io/maintenance-tracker/)

---

## Author and Contributors

- Tutu Godfrey<godfrey_tutu@yahoo.com>

---