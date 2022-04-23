const { body, validationResult } = require('express-validator');

const fieldsRequired = (field, nameField) => {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(nameField + ' không được để trống');
};

module.exports = {
  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessage = errors.array().map(({ msg }) => msg);
      throw next(new Error(errorsMessage));
    }
    next();
  },

  register: [
    fieldsRequired('email', 'Email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .normalizeEmail(),
    fieldsRequired('username', 'Username')
      .matches(/^[a-zA-Z0-9]*$/)
      .withMessage('Username không đúng định dạng')
      .isLength({ min: 4, max: 20 })
      .withMessage('Username từ 4 đến 20 kí tự'),
    fieldsRequired('password', 'Mật khẩu')
      .isLength({ min: 4, max: 20 })
      .withMessage('Mật khẩu từ 4 đến 20 kí tự'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu nhập không trùng khớp');
      }
      return true;
    })
  ],

  login: [
    fieldsRequired('email', 'Email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .normalizeEmail(),
    fieldsRequired('password', 'Mật khẩu')
      .isLength({ min: 6, max: 20 })
      .withMessage('Mật khẩu từ 6 đến 20 kí tự')
  ],

  createWeddingMoney: [
    fieldsRequired('name', 'Tên'),
    fieldsRequired('money', 'Số tiền').isInt({ min: 1 }).withMessage('Số tiền phải lớn hơn 0')
  ],

  updateWeddingMoney: [
    fieldsRequired('money', 'Số tiền').isInt({ min: 1 }).withMessage('Số tiền phải lớn hơn 0')
  ]
};
