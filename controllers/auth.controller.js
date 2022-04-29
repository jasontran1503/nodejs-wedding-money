const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Register
 * @route POST api/auth/register
 * @body email, username, password, confirmPassword
 */
const register = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  try {
    const userFoundByEmail = await User.findOne({ email });

    if (userFoundByEmail) {
      throw new Error('Email đã tồn tại');
    }
    const user = await User.create({ email, username, password });

    return res.status(200).json({
      success: true,
      message: 'Đăng kí thành công',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login
 * @route POST api/auth/login
 * @body email, password
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Không tìm thấy user');
    }
    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });

      const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        domain: 'verdant-mandazi-17234a'
      };

      return res.status(200).cookie('token', token, options).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: token
      });
    } else {
      throw new Error('Đăng nhập thất bại');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Log out
 * @route POST api/auth/logout
 */
const logout = async (req, res, next) => {
  res.clearCookie('token');

  return res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

/**
 * Get current user
 * @route GET api/auth/user
 */
const getCurrentUser = async (req, res, next) => {
  const user = req.user;

  try {
    if (!user) {
      throw new Error('Không tìm thấy user');
    }
    return res.status(200).json({
      success: true,
      message: 'Thành công',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticated
 * @route GET api/auth/is-auth
 */
const isAuthenticated = async (req, res, next) => {
  try {
    const isAuth = req.cookies.token ? true : false;

    return res.status(200).json({
      success: true,
      message: '',
      data: isAuth
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile
 * @route PUT api/auth/update-profile
 * @body username, password, newPassword, confirmNewPassword
 */
const updateProfile = async (req, res, next) => {
  const user = req.user;
  const { username, oldPassword, newPassword } = req.body;

  try {
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không đúng.');
    }

    user.username = username;
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thành công.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  register,
  getCurrentUser,
  isAuthenticated,
  updateProfile
};
