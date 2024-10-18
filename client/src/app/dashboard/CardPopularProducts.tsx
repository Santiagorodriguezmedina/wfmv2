import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";

const Dashboard = () => {
  const { data, error, isLoading } = useGetDashboardMetricsQuery();
  // State to hold the dynamically selected date

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Popular Products</h2>

      <ul>
        {data?.popularProducts.map((product) => (
          <li key={product.productId} className="product-item">
            <div className="product-details">
              
              {/* Product name */}
              <span>{product.name}</span>
              
              {/* Product stock quantity */}
              <span>Stock: {product.stockQuantity}</span>

              {/* Product stock quantity */}
              <span>Stock: {product.description}</span>

            </div>
          </li>
        ))}
      </ul>



      {/* Render other metrics similarly */}
    </div>
  );
};

export default Dashboard;