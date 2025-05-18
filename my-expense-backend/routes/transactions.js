// routes/transaction.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addTransaction } from '../controllers/TransactionController.js';
const router = express.Router();

// Test route
router.get('/', authMiddleware, (req, res) => {
  res.send('Transaction route works!');
});

// Add Transaction
router.post('/add', authMiddleware, addTransaction);

export default router;
