const mongoose = require('mongoose');

const WeddingMoneySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    money: {
      type: Number,
      trim: true,
      required: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    note: {
      type: String,
      lowercase: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('WeddingMoney', WeddingMoneySchema);
