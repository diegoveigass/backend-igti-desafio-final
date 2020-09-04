const TransactionModel = require('../models/TransactionModel');
const yup = require('yup');

const findAllDates = async (request, response) => {
  const allDates = await TransactionModel.collection.distinct('yearMonth');

  try {
    return response.json(allDates);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

const findByPeriod = async (request, response) => {
  const { period } = request.query;

  if (!period) {
    return response
      .status(400)
      .json({ error: 'Period is necessary in this format yyyy-mm' });
  }

  const transactions = await TransactionModel.find({
    yearMonth: period,
  }).sort({ day: 'asc' });

  try {
    return response.json({ length: transactions.length, transactions });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

const deleteTransaction = async (request, response) => {
  const { id } = request.params;

  const transaction = await TransactionModel.findByIdAndDelete(id);

  if (!transaction) {
    return response.status(400).json({ error: 'Transaction not found!' });
  }

  try {
    return response.send();
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

const addTransaction = async (request, response) => {
  const { description, value, category, year, month, day, type } = request.body;

  const schema = yup.object().shape({
    description: yup.string().required(),
    value: yup.number().positive().required(),
    category: yup.string().required(),
    year: yup.number().positive().required(),
    month: yup.number().positive().required(),
    day: yup.number().positive().required(),
    type: yup.string().required(),
  });

  if (!(await schema.isValid(request.body))) {
    return response
      .status(400)
      .json({ error: 'Validation fails when create transaction' });
  }

  var transaction = new TransactionModel({
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth: `${year}-${month}`,
    yearMonthDay: `${year}-${month}-${day}`,
    type,
  });

  await transaction.save();

  try {
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

const updateTransaction = async (request, response) => {
  const { id } = request.params;
  const { description, value, category, year, month, day, type } = request.body;

  const schema = yup.object().shape({
    description: yup.string().required(),
    value: yup.number().positive().required(),
    category: yup.string().required(),
    year: yup.number().positive().required(),
    month: yup.number().positive().required(),
    day: yup.number().positive().required(),
    type: yup.string().required(),
  });

  if (!(await schema.isValid(request.body))) {
    return response
      .status(400)
      .json({ error: 'Validation fails when create transaction' });
  }

  const transaction = await TransactionModel.findByIdAndUpdate(
    id,
    {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: `${year}-${month}`,
      yearMonthDay: `${year}-${month}-${day}`,
      type,
    },
    { new: true }
  );

  try {
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

module.exports = {
  findAllDates,
  findByPeriod,
  deleteTransaction,
  addTransaction,
  updateTransaction,
};
