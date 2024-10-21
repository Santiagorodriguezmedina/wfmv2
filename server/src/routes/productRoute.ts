import { Router } from "express";
import { createProduct, getProducts, updateProduct } from "../controllers/productController";

const router = Router();

// GET route to fetch products
router.get("/", getProducts);

// POST route to create a product
router.post("/", createProduct);

// PUT route to fetch products
router.put("/:id", updateProduct);

export default router;