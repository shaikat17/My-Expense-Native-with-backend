// routes/transaction.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Example route
router.get('/', authMiddleware, (req, res) => {
  res.send('Transaction route works!');
});

export default router;
