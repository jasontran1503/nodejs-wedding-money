const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user.model');

module.exports = {
  guard: async (req, res, next) => {
    let token;
    try {
      if (req.cookies.token) {
        token = req.cookies.token;
      }
      if (!token) {
        const error = createError.Unauthorized('Bạn cần phải đăng nhập');
        throw error;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  }
};
