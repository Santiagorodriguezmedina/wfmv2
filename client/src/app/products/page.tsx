"use client";

import { useCreateProductMutation, useGetProductsQuery, useDeleteProductMutation,} from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";

type ProductFormData = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  description: string;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // To store the selected product ID

  const {
    data: products,
    isLoading,
    isError,
    refetch: refetchProducts,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation(); // Hook for delete mutation

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
    handleFetchProducts(); // Refetch products after creation
  };

  const handleFetchProducts = async () => {
    await refetchProducts(); // Ensure it returns a Promise
  };

  const handleDeleteProduct = async (productId: string) => { // Change productId type to string
    try {
      await deleteProduct(productId).unwrap(); // Unwrap to handle errors better
      handleFetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error("Failed to delete the product: ", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId); // Set the selected product ID
  };


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
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products?.map((product) => (
          <div
            key={product.productId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            onClick={() => handleProductClick(product.productId)} // Handle product click
          >
            <div className="flex flex-col items-center">
              <Image
                src={`https://s3-inventorymanagement-wfmv2.s3.us-east-2.amazonaws.com/product${
                  Math.floor(Math.random() * 3) + 1
                }.png`}
                alt={product.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              )}
              <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from triggering product selection
                  handleDeleteProduct(product.productId);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        fetchProducts={handleFetchProducts} // Pass the function to refetch products
      />
    </div>
  );
};

export default Products;
