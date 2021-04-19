const Transaction = require("../model/Transaction");
const User = require("../model/User");

const router = require("express").Router();

// dashboard route
router.get("/", async (req, res) => {
  try {
    const savedTransactions = await Transaction.find();
    res.json({ error: null, data: savedTransactions });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/send-money", async (req, res) => {
  const isEmailRecipientExist = await User.findOne({ email: req.body.recipientAccount });

  if (!isEmailRecipientExist)
    return res.status(400).json({ error: "Email Recipient not exists" });
  if (req.body.recipientAccount === req.user.email)
    return res.status(400).json({ error: "This is your email" });

  const transactions = new Transaction({
    senderAccount: req.user.email,
    recipientAccount: req.body.recipientAccount,
    amount: req.body.amount,
  });

  try {
    const savedTransactions = await transactions.save();
    res.json({ error: null, data: savedTransactions });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/send-money-url", async (req, res) => {
  const recipientAccount = req.query.recipientAccount;
  const amount = req.query.amount;
  const isEmailRecipientExist = await User.findOne({ email: recipientAccount });

  if (!isEmailRecipientExist)
    return res.status(400).json({ error: "Email Recipient not exists" });

  const transactions = new Transaction({
    senderAccount: req.user.email,
    recipientAccount: recipientAccount,
    amount: amount,
  });

  try {
    const savedTransactions = await transactions.save();
    res.json({ error: null, data: savedTransactions });
  } catch (error) {
    res.status(400).json({ error });
  }
});


module.exports = router;

