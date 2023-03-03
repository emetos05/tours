const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// View routes
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/me', authController.protectRoute, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protectRoute,
  viewController.updateUserData
);

module.exports = router;