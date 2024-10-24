"use client";

import { useCreateSalesMutation, useGetSalesQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateSalesModal from "./CreateSalesModal";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns'; // To format dates

type SalesFormData = {
  saleId: string;
  productId: string; 
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid: string;
  createdAt: string;
};

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState<string | null>(null); // To store the selected product ID
  const [filterDate, setFilterDate] = useState(""); // Filter by date

  const {
    data: sales,
    isLoading,
    isError,
    refetch: refetchSales,
  } = useGetSalesQuery(searchTerm);

  const [createSales] = useCreateSalesMutation();

  const handleCreateSales = async (salesData: SalesFormData) => {
    try {
      // Create the sale
      const response = await createSales(salesData).unwrap();
      
      console.log("Sale created successfully", response);
      
      // Refetch sales after creation to get the latest data
      await refetchSales(); 
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  const handleFetchSales = async () => {
    await refetchSales(); // Ensure it returns a Promise
  };

  const handleSalesClick = (salesId: string) => {
    setSelectedSalesId(salesId); // Set the selected sale ID
  };

  const columns: GridColDef[] = [
    { field: 'saleId', headerName: 'Sale ID', width: 80 },
    { field: 'userid', headerName: 'User ID', width: 80 },
    { field: 'productId', headerName: 'Product ID', width: 80 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 80 },
    { field: 'unitPrice', headerName: 'Unit Price ($)', width: 80 },
    { field: 'totalAmount', headerName: 'Total Amount ($)', width: 80},
    { field: 'description', headerName: 'Description', width: 200 }, 
    { field: 'createdAt', headerName: 'Created At', width: 150 },
  ];

  // Filter sales based on selected date (if any)
  const filteredSales = filterDate
    ? sales?.filter((sale) => sale.createdAt.startsWith(filterDate)) // Simple filter by matching date start
    : sales;

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !sales) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch sales
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
  
      {/* DATE FILTER */}
      <div className="mb-6">
        <input
          type="date"
          className="border border-gray-300 rounded py-2 px-4"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filter by date"
        />
      </div>
  
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Sales" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Sale
        </button>
      </div>
  
      {/* SALES TABLE */}
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredSales?.map((sale) => ({
            id: sale.saleId, // Ensure the `id` field is set correctly for DataGrid
            saleId: sale.saleId,
            userid: sale.userid,
            productId: sale.productId,
            productName: sale.productName, // Add productName
            quantity: sale.quantity,
            unitPrice: sale.unitPrice,
            totalAmount: sale.totalAmount,
            description: sale.description, // Add description
            createdAt: format(new Date(sale.createdAt), 'yyyy-MM-dd HH:mm:ss'), // Format the createdAt date
          })) || []}
          columns={columns}
          paginationModel={{ pageSize: 10, page: 0 }} // Use paginationModel instead of pageSize
          onPaginationModelChange={(newModel) => console.log(newModel)} // Add this if you want to control pagination
          onRowClick={(params) => handleSalesClick(params.row.saleId)} // Handle row click
        />
      </div>
  
      {/* MODAL */}
      <CreateSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSales} // Updated to use create sales handler
        fetchSales={handleFetchSales} // Pass the function to refetch sales
      />
    </div>
  );
}

export default Sales;
