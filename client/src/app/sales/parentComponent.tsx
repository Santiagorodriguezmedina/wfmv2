import React, { useState } from "react";
import CreateSalesModal from "./CreateSalesModal"; // Import the modal
import { SalesFormData } from "@/state/api"; // Import the SalesFormData interface

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSale = async (formData: SalesFormData) => {
    // Logic to handle creating a sale
    console.log("Form Data:", formData);
    // Add your API call to create the sale here
  };

  const fetchSales = async () => {
    // Logic to refetch sales after creating a new sale
    console.log("Refetching sales...");
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Create Sale</button>
      <CreateSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSale}
        fetchSales={fetchSales}
      />
    </div>
  );
};

export default ParentComponent;
