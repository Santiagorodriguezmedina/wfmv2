
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = parseInt(req.params.id, 10); // Parse productId as an integer
  
      const { name, price, rating, stockQuantity, description } = req.body;
  
      const product = await prisma.products.update({
        where: { productId }, // Match the 'productId' field in your Prisma model
        data: {
          productId,
          name,
          price,
          rating,
          stockQuantity,
          description,
        },
      });
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);  // Log the error for debugging
      res.status(500).json({ message: 'Error updating product' });
    }
  };