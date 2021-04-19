const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  senderAccount: {
    type: String,
    required: true,
    max: 255,
  },
  recipientAccount: {
    type: String,
    required: true,
    max: 255,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
