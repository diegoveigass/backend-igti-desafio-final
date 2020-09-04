const express = require('express');
const transactionRouter = express.Router();

const {
  findAllDates,
  findByPeriod,
  deleteTransaction,
  addTransaction,
  updateTransaction,
} = require('../controller/transactionsController');

transactionRouter.get('/all_dates', findAllDates);
transactionRouter.get('/by_period', findByPeriod);
transactionRouter.delete('/delete_transaction/:id', deleteTransaction);
transactionRouter.post('/', addTransaction);
transactionRouter.put('/:id', updateTransaction);

module.exports = transactionRouter;
