import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import { v4 } from "uuid";
import { useGetProductsQuery } from "@/state/api"; // Ensure this import matches your structure

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

type CreateSalesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: SalesFormData) => Promise<void>;
  fetchSales: () => Promise<void>;
};

const CreateSalesModal = ({
  isOpen,
  onClose,
  onCreate,
  fetchSales,
}: CreateSalesModalProps) => {
  const [formData, setFormData] = useState<SalesFormData>({
    saleId: v4(),
    productId: "",
    productName: "",
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    description: "",
    userid: "",
    createdAt: new Date().toISOString(), // Set current timestamp
  });

  const { data: products } = useGetProductsQuery(); // Fetch products
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error messages

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "quantity" || name === "unitPrice"
          ? parseFloat(value)
          : value,
    }));
  
    // Clear error message if product or quantity changes
    if (name === "productId" || name === "quantity") {
      setErrorMessage(""); // Clear any previous error message
    }
  };

  // Effect to update total amount whenever quantity or unit price changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: prevData.quantity * prevData.unitPrice,
    }));
  }, [formData.quantity, formData.unitPrice]);

  // Effect to set the product name based on selected product
  useEffect(() => {
    const selectedProduct = products?.find(
      (product) => product.productId === formData.productId
    );
    setFormData((prevData) => ({
      ...prevData,
      productName: selectedProduct ? selectedProduct.name : "", // Set productName when productId changes
      unitPrice: selectedProduct ? selectedProduct.price : 0, // Update unitPrice with selected product's price
    }));
  }, [formData.productId, products]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if stock is sufficient
    const selectedProduct = products?.find(
      (product) => product.productId === formData.productId
    );

    if (selectedProduct && formData.quantity > selectedProduct.stockQuantity) {
      setErrorMessage("Insufficient stock available for this product.");
      return; // Prevent form submission if stock is not enough
    }

    setErrorMessage(""); // Clear any previous error message
    try {
      await onCreate(formData);
      await fetchSales();
      onClose();
    } catch (error) {
      setErrorMessage("Failed to create sale. Please try again.");
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <Header name="Create New Sale" />
          {errorMessage && (
            <div className="mb-4 text-red-600">{errorMessage}</div> // Display error message
          )}
          <form onSubmit={handleSubmit} className="mt-5">
            {/* Product Selection */}
            <label htmlFor="productId" className={labelCssStyles}>
              Product
            </label>
            <select
              name="productId"
              onChange={(e) => {
                const selectedProduct = products?.find(
                  (product) => product.productId === e.target.value
                );
                setFormData((prevData) => ({
                  ...prevData,
                  productId: e.target.value,
                  // The productName is set in the effect above
                }));
              }}
              value={formData.productId}
              className={inputCssStyles}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products?.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.name} - ${product.price.toFixed(2)} (Stock: {product.stockQuantity})
                </option>
              ))}
            </select>
  
            {/* User ID */}
            <label htmlFor="userid" className={labelCssStyles}>
              User ID
            </label>
            <input
              type="text"
              name="userid"
              placeholder="User ID"
              onChange={handleChange}
              value={formData.userid}
              className={inputCssStyles}
              required
            />
  
            {/* Timestamp */}
            <label htmlFor="createdAt" className={labelCssStyles}>
              Created Date
            </label>
            <input
              type="text"
              name="createdAt"
              value={formData.createdAt}
              readOnly
              className={inputCssStyles}
            />
  
            {/* Quantity */}
            <label htmlFor="quantity" className={labelCssStyles}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              onChange={handleChange}
              value={formData.quantity}
              className={inputCssStyles}
              required
            />
  
            {/* Unit Price */}
            <label htmlFor="unitPrice" className={labelCssStyles}>
              Unit Price
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              readOnly
              className={inputCssStyles}
            />
  
            {/* Total Amount */}
            <label htmlFor="totalAmount" className={labelCssStyles}>
              Total Amount
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className={inputCssStyles}
            />
  
            {/* Description Field */}
            <label htmlFor="description" className={labelCssStyles}>
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
              className={inputCssStyles}
            />
  
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };

export default CreateSalesModal;
