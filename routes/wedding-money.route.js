const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const weddingMoneyController = require('../controllers/wedding-money.controller');
const validation = require('../helpers/validation.helper');

router.post(
  '/create',
  auth.guard,
  validation.createWeddingMoney,
  validation.handleValidationErrors,
  weddingMoneyController.createWeddingMoney
);
router.get('/', auth.guard, weddingMoneyController.getWeddingMoneyById);
router.get('/search', auth.guard, weddingMoneyController.searchWeddingMoney);
router.delete('/:id', auth.guard, weddingMoneyController.deleteWeddingMoneyById);
router.put(
  '/update',
  auth.guard,
  validation.updateWeddingMoney,
  validation.handleValidationErrors,
  weddingMoneyController.updateWeddingMoney
);

module.exports = router;
