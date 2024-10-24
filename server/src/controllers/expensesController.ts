import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpenses = async (req: Request,res: Response): Promise<void> => {
    try {
      const search = req.query.search?.toString();
      const expenses = await prisma.expenses.findMany({
        where: {
          expenseId: {
            contains: search,
          },
        },
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving expenses" });
    }
  };



export const createExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expenseId, productId, productName, quantity, unitPrice, totalAmount, description, userid, createdAt } = req.body;

    // Fetch the product to check stock
    const product = await prisma.products.findUnique({
      where: { productId },
    });

    // Check if the product exists
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    // Create the sale
    const expenses = await prisma.expenses.create({
      data: {
        expenseId,  
        productId , 
        productName,
        quantity,   
        unitPrice,  
        totalAmount,
        description,
        userid,   
        createdAt,  
      },
    });

    console.log("Expense created:", expenses); // Log the created sale

    // Update the product stock
    const newStockQuantity = product.stockQuantity + quantity;
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
    res.status(201).json({ expenses, updatedProduct });
  } catch (error) {
    console.error("Error creating espense:", error);
    res.status(500).json({ message: "Error creating expense", error: (error as Error).message });
  }
};
