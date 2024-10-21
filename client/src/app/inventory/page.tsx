"use client"; // Add this line to mark the component as a Client Component

import React, { useState } from "react";
import { useGetProductsQuery, useUpdateProductMutation, Product } from "@/state/api"; // Import types and mutations
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [editRows, setEditRows] = useState<Product[]>([]); // Store edited rows

  const processRowUpdate = async (newRow: any, oldRow: any) => {
    try {
      const updatedProduct = { ...newRow };
      await updateProduct({ productId: updatedProduct.productId, updatedProduct });
      console.log("Product updated successfully");
      return updatedProduct;
    } catch (error) {
      console.error("Failed to update product", error);
      return oldRow; // Revert changes on error
    }
  };

  const handleProcessRowUpdateError = (error: any) => {
    console.error("Error while updating row:", error);
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Product Name",
      width: 200,
      editable: true, // Enable editing
    },
    {
      field: "description",
      headerName: "Description",
      width: 110,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      editable: true,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      editable: true,
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => processRowUpdate(params.row, params.row)} // Save the changes
        >
          Save
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        rows={products.map((product) => ({
          ...product,
          isEditing: editRows.some((edited) => edited.productId === product.productId),
        }))}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        processRowUpdate={processRowUpdate} // Handle cell edit
        onProcessRowUpdateError={handleProcessRowUpdateError} // Handle errors
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;
