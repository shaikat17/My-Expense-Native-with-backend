// routes/transaction.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addTransaction, deleteTransaction, getCurrentTransactions, getTransactionsByMonthAndYear, getTransactionsByYear, updateTransaction } from '../controllers/TransactionController.js';
const router = express.Router();

// Test route
router.get('/', authMiddleware, (req, res) => {
  res.send('Transaction route works!');
});

// Add Transaction
router.post('/add', authMiddleware, addTransaction);

// Get Current Month Transactions
router.get('/current', authMiddleware, getCurrentTransactions);

// Delete Transaction
router.delete('/delete/:id', authMiddleware, deleteTransaction);

// update Transaction
router.put('/update/:id', authMiddleware, updateTransaction);

// Get Transactions by Month and Year
router.get('/monthly', authMiddleware, getTransactionsByMonthAndYear);

// Get Transactions by Year
router.get('/yearly', authMiddleware, getTransactionsByYear);

export default router;
