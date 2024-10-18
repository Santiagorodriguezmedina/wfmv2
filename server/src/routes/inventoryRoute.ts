import { Router } from "express";
import { updateProduct } from "../controllers/inventoryController";

const router = Router();

// PUT route to fetch products
router.put("/:id", updateProduct);

export default router;