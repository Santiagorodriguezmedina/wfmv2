import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct} from "../controllers/productController";

const router = Router();

// GET route to fetch products
router.get("/", getProducts);

// POST route to create a product
router.post("/", createProduct);

// PUT route to fetch products
router.put("/:id", updateProduct);

// DELETE route to delete a product
router.delete("/:id", deleteProduct);

export default router;