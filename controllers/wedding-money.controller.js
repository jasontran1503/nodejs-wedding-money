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

    const weddingMoney = await WeddingMoney.findById(req.query.id);
    if (!weddingMoney) {
      throw new Error('Dữ liệu không tồn tại');
    } else {
      if (!weddingMoney.user.equals(user._id)) {
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
      }
      const updated = await WeddingMoney.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updated
      });
    }
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
    const data = await WeddingMoney.findById(req.query.id).populate('user', 'username email');

    if (!data) {
      throw new Error('Dữ liệu không tồn tại');
    } else {
      if (!data.user.equals(req.user._id)) {
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
      }
      return res.status(200).json({
        success: true,
        message: 'Thành công',
        data
      });
    }
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
    const data = await WeddingMoney.findByIdAndDelete(req.params.id);

    if (!data) {
      throw new Error('Dữ liệu không tồn tại');
    } else {
      if (!data.user.equals(req.user._id)) {
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
      }
      return res.status(200).json({
        success: true,
        message: 'Xóa thành công',
        data
      });
    }
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
    const result = await WeddingMoney.find(searchCondition).lean();
    let data = [];

    if (!result) {
      throw new Error('Không tìm thấy dữ liệu');
    } else {
      data = result.filter((item) => item.user.equals(req.user._id));
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
