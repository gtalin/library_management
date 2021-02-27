const router = require('express').Router();
const basicAuth = require('express-basic-auth');

const adminController = require('../controllers/adminController');
const basicAuthOptions = require('../config/basicAuthOptions');

router.get('/login', (req, res, next) => {
  res.render('./admin/login', { title: 'Login' });
});

// This is to protect the dashboard route
router.use(basicAuth(basicAuthOptions));

// router.get('/dashboard', (req, res, next) => {
//   res.render('./admin/dashboard', { title: 'Dashboard', user: req.auth.user });
// });

router.get('/dashboard', adminController.admin_dashboard);

module.exports = router;
