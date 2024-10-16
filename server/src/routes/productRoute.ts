import { Router } from "express";
import { createProduct, getProducts, deleteProduct } from "../controllers/productController";

const router = Router();

// GET route to fetch products
router.get("/", getProducts);

// POST route to create a product
router.post("/", createProduct);

// DELETE route to delete a product by ID
router.delete("/:id", deleteProduct); // Add this line for DELETE functionality

export default router;