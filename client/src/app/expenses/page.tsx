"use client";

import { useCreateExpensesMutation, useGetExpensesQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateExpensesModal from "./CreateExpensesModal";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns'; // To format dates

type ExpensesFormData = {
  expenseId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid: string; 
  createdAt: string; 
};


const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpensesId, setSelectedExpensesId] = useState<string | null>(null); // To store the selected product ID
  const [filterDate, setFilterDate] = useState(""); // Filter by date

  const {
    data: expenses,
    isLoading,
    isError,
    refetch: refetchExpenses,
  } = useGetExpensesQuery(searchTerm);

  const [createExpenses] = useCreateExpensesMutation();

  const handleCreateExpenses = async (expensesData: ExpensesFormData) => {
    try {
      // Create the expemse
      const response = await createExpenses(expensesData).unwrap();
      
      console.log("Expense created successfully", response);
      
      // Refetch expenses after creation to get the latest data
      await refetchExpenses(); 
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleFetchExpenses = async () => {
    await refetchExpenses(); // Ensure it returns a Promise
  };

  const handleExpensesClick = (expenseId: string) => {
    setSelectedExpensesId(expenseId); // Set the selected expense ID
  };

  const columns: GridColDef[] = [
    { field: 'expenseId', headerName: 'Expense ID', width: 80 },
    { field: 'userid', headerName: 'User ID', width: 80 },
    { field: 'productId', headerName: 'Product ID', width: 80 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 80 },
    { field: 'unitPrice', headerName: 'Unit Price ($)', width: 80 },
    { field: 'totalAmount', headerName: 'Total Amount ($)', width: 80},
    { field: 'description', headerName: 'Description', width: 200 }, 
    { field: 'createdAt', headerName: 'Created At', width: 150 }, 
  ];

  // Filter expenses based on selected date (if any)
  const filteredExpenses = filterDate
  ? expenses?.filter((expense) =>
      format(new Date(expense.createdAt), 'yyyy-MM-dd') === filterDate
    )
  : expenses;

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !expenses) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
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
            placeholder="Search expense..."
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
        <Header name="Expenses" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Expense
        </button>
      </div>
  
      {/* EXPENSES TABLE */}
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredExpenses?.map((expense) => ({
            id: expense.expenseId, // Ensure the `id` field is set correctly for DataGrid
            expenseId: expense.expenseId,
            userid: expense.userid,
            productId: expense.productId,
            productName: expense.productName,
            quantity: expense.quantity,
            unitPrice: expense.unitPrice, // Keep unitPrice as is
            totalAmount: expense.totalAmount, // Ensure totalAmount is passed through without modification
            description: expense.description,
            createdAt: format(new Date(expense.createdAt), 'yyyy-MM-dd HH:mm:ss'), // Format the date
          })) || []}
          columns={columns}
          paginationModel={{ pageSize: 10, page: 0 }} // Use paginationModel instead of pageSize
          onPaginationModelChange={(newModel) => console.log(newModel)} // Add this if you want to control pagination
          onRowClick={(params) => handleExpensesClick(params.row.expenseId)} // Handle row click
        />
      </div>
  
      {/* MODAL */}
      <CreateExpensesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExpenses} // Updated to use create expenses handler
        fetchExpenses={handleFetchExpenses} // Pass the function to refetch expenses
      />
    </div>
  );
};

export default Expenses;
