import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSales = async (req: Request,res: Response): Promise<void> => {
    try {
      const search = req.query.search?.toString();
      const sales = await prisma.sales.findMany({
        where: {
          saleId: {
            contains: search,
          },
        },
      });
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sales" });
    }
  };

export const createSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { saleId, productId, timestamp, quantity, unitPrice, totalAmount, userid } = req.body;

    // Fetch the product to check stock
    const product = await prisma.products.findUnique({
      where: { productId },
    });

    // Check if the product exists
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    // Check if there is sufficient stock
    if (product.stockQuantity < quantity) {
      res.status(400).json({ message: "Insufficient stock available." });
      return;
    }

    // Create the sale
    const sales = await prisma.sales.create({
      data: {
        saleId,
        productId,
        timestamp,
        quantity,
        unitPrice,
        totalAmount,
        userid,
      },
    });

    console.log("Sale created:", sales); // Log the created sale

    // Update the product stock
    const newStockQuantity = product.stockQuantity - quantity;
    await prisma.products.update({
      where: { productId },
      data: { stockQuantity: newStockQuantity },
    });

    // Fetch the updated product to return its new stock quantity
    const updatedProduct = await prisma.products.findUnique({
      where: { productId },
    });

    console.log(`Stock updated for productId ${productId}: ${newStockQuantity}`);

    // Return the created sale and the updated product stock
    res.status(201).json({ sales, updatedProduct });
  } catch (error) {
    console.error("Error creating sales:", error);
    res.status(500).json({ message: "Error creating sales", error: (error as Error).message });
  }
};
