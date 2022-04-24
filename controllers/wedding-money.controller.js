const User = require('../models/user.model');
const WeddingMoney = require('../models/wedding-money.model');

/**
 * Create wedding money
 * @route POST api/wedding-money/create
 * @body name, note, phoneNumber, money
 */
const createWeddingMoney = async (req, res, next) => {
  const { name, note, phoneNumber, money } = req.body;
  req.body.user = req.user._id;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    const found = await WeddingMoney.findOne({ name });
    if (found) {
      throw new Error('Tên vừa nhập đã tồn tại');
    }
    const newMoney = await WeddingMoney.create(req.body);

    return res.status(200).json({
      success: true,
      message: 'Thêm thành công',
      data: newMoney
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update wedding money
 * @route PUT api/wedding-money/update
 * @body note, phoneNumber, money
 * @params id
 */
const updateWeddingMoney = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    const data = await WeddingMoney.findOneAndUpdate(
      { user: req.user._id, _id: req.query.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!data) {
      throw new Error('Dữ liệu không tồn tại');
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get wedding money by id
 * @route GET api/wedding-money
 * @params id
 */
const getWeddingMoneyById = async (req, res, next) => {
  try {
    const data = await WeddingMoney.findOne({ user: req.user._id, _id: req.query.id }).populate(
      'user',
      'username email'
    );

    if (!data) {
      throw new Error('Dữ liệu không tồn tại');
    }

    return res.status(200).json({
      success: true,
      message: 'Thành công',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete wedding money by id
 * @route DELETE api/wedding-money/:id
 */
const deleteWeddingMoneyById = async (req, res, next) => {
  try {
    const data = await WeddingMoney.findOneAndDelete({ user: req.user._id, _id: req.params.id });

    if (!data) {
      throw new Error('Dữ liệu không tồn tại');
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa thành công',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search wedding money
 * @route GET api/wedding-money/search
 * @params name, phoneNumber
 */
const searchWeddingMoney = async (req, res, next) => {
  const { name, phoneNumber } = req.query;
  const searchCondition = {
    user: req.user._id,
    name: { $regex: String(name), $options: 'i' },
    phoneNumber: { $regex: String(phoneNumber), $options: 'i' }
  };
  if (!name) {
    delete searchCondition.name;
  }
  if (!phoneNumber) {
    delete searchCondition.phoneNumber;
  }

  try {
    const data = await WeddingMoney.find(searchCondition);

    if (!data) {
      throw new Error('Không tìm thấy dữ liệu');
    }

    return res.status(200).json({
      success: true,
      message: '',
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWeddingMoney,
  updateWeddingMoney,
  getWeddingMoneyById,
  deleteWeddingMoneyById,
  searchWeddingMoney
};
