const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const validation = require('../helpers/validation.helper');

router.post(
  '/register',
  validation.register,
  validation.handleValidationErrors,
  authController.register
);
router.post('/login', validation.login, validation.handleValidationErrors, authController.login);
router.post('/logout', auth.guard, authController.logout);
router.get('/user', auth.guard, authController.getCurrentUser);
router.get('/is-auth', authController.isAuthenticated);
router.put(
  '/update-profile',
  auth.guard,
  validation.updateProfile,
  validation.handleValidationErrors,
  authController.updateProfile
);

module.exports = router;
