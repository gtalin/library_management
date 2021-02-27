exports.checkIfAuth = (req, res, next) => {
  console.log('Basic auth middleware executed');
  console.log('authorization header ', req.headers.authorization);
  // console.log("auth headers", req.headers)
  console.log('User is req.auth', req.auth); // this is set only when basicAuth is executed immediately before. So it will not be accessible here but will be accessible in controller part in req

  // req.headers.authorization gets set when a user is logged in
  // and it persists
  // NOTE:: here we're just checking that authorization header is present
  // We don't check if it's value is correct or not. That is done by the actual basicAuth middleware where we actually protect the route.
  // In this case if the authorization header is set, but is wrong, we'll still see the things which require isLoggedIn to be true.
  if (req.headers.authorization) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }

  next();
};
