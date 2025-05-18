import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
  try {
      const { type, amount, category, note, date } = req.body.transaction;
      console.log(req.body)

    const transaction = new Transaction({
      type: type?.toLowerCase(), // Ensure type is lowercase
      amount,
      category,
      note,
      date,
      user: req.user.id, // authMiddleware sets req.user
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction,
    });
  } catch (error) {
      console.log("🚀 ~ addTransaction ~ error:", error)
    res.status(500).json({ error: 'Something went wrong' });
  }
};
