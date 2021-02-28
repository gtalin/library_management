const router = require('express').Router();
const basicAuth = require('express-basic-auth');
const borrowerController = require('../controllers/borrowerController');
const basicAuthOptions = require('../config/basicAuthOptions');

//  /********* BORROWER ROUTES *********/ //
// GET request for creating a borrower. NOTE this must come before routes that display borrower (uses id)

// Protect the route so that it is accessible only to logged in users
router.use(basicAuth(basicAuthOptions));

// GET request for list of all borrower items
router.get('/borrowers', borrowerController.borrower_list);
router.get('/borrowers/:page', borrowerController.borrower_list);

router.get('/create', borrowerController.borrower_create_get);

// POST request for creating borrower
router.post('/create', borrowerController.borrower_create_post);

// GET request for deleting a borrower
router.get('/:id/delete', borrowerController.borrower_delete_get);

// POST request for deleting a borrower
router.post('/:id/delete', borrowerController.borrower_delete_post);

// GET request for updating a borrower
router.get('/:id/update', borrowerController.borrower_update_get);

// POST request for updating a borrower
router.post('/:id/update', borrowerController.borrower_update_post);

// GET request for one borrower
router.get('/:id', borrowerController.borrower_detail);

module.exports = router;
