import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = new Transaction({
      type,
      amount,
      category,
      note,
      date,
      user: req.user.id, // assuming authMiddleware sets req.user
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
