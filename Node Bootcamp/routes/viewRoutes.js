const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticationController');
const viewController = require('../controllers/viewsController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
module.exports = router;