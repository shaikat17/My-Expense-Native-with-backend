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


export const getCurrentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // for example (2025, 4, 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // for example (2025, 4, 30, 23, 59, 59, 999)

    const transactions = await Transaction.find({
      user: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('🚨 ~ getTransactions ~ error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('🚨 ~ deleteTransaction ~ error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      req.body.transaction,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error('🚨 ~ updateTransaction ~ error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};