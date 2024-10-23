import { Router } from "express";
import { getSales, createSales} from "../controllers/salesController";

const router = Router();

// GET route to fetch products
router.get("/", getSales);

// POST route to create a product
router.post("/", createSales);

export default router;