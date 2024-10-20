import { Router } from "express";
import { createProduct, getProducts, } from "../controllers/productController";

const router = Router();

// GET route to fetch products
router.get("/", getProducts);

// POST route to create a product
router.post("/", createProduct);


export default router;