// This variable was created to have all options for protecting route in one place
const basicAuthOptions = {
  users: { admin: 'admin' },
  challenge: true,
  unauthorizedResponse: (req, res) =>
    `<h1>Unauthorised access. Please login</h1>`,
  // res.render('error');
};

module.exports = basicAuthOptions;
