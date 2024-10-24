import { Router } from "express";
import { getExpenses, createExpenses } from '../controllers/expensesController';

const router = Router();

// GET route to fetch expenses
router.get('/', getExpenses);

// POST route to create a expenses
router.post('/', createExpenses);

export default router;