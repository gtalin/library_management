// This variable was created to have all options for protecting route in one place
const dotenv = require('dotenv');

dotenv.config();
// need to import 'dotenv' to use process.env.BASIC_AUTH_PASSWORD

const basicAuthOptions = {
  users: { admin: process.env.BASIC_AUTH_PASSWORD },
  challenge: true,
  unauthorizedResponse: (req, res) =>
    `<h1>Unauthorised access. Please login</h1>`,
  // res.render('error');
};

module.exports = basicAuthOptions;
