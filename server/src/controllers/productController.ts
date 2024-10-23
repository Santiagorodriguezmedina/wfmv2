import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request,res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity, description } = req.body;

    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
        description,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the productId from the URL params
    const updatedData = req.body; // Get the updated product data from the request body

    const updatedProduct = await prisma.products.update({
      where: {
        productId: id, 
      },
      data: updatedData, // Update with new data
    });

    res.json(updatedProduct); // Return the updated product
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id; 

    // Delete the product using Prisma
    await prisma.products.delete({
      where: { productId }, // Match the 'productId' field in your Prisma model
    });

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error('Error deleting product:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting product' });
  }
};