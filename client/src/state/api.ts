import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  description: string;
}
export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  description: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
}

export interface Sales {
  salesId: string;
  userid: string;
  timestamp: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products"],
  endpoints: (build) => ({

    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Add the new query to get product by ID
    getProductsById: build.query<Product, string>({
      query: (id) => `/products/${id}`, // Adjust based on your route
      providesTags: ["Products"],
    }),

    updateProduct: build.mutation<Product, { productId: string; updatedProduct: NewProduct }>({
      query: ({ productId, updatedProduct }) => ({
        url: `/products/${productId}`, // Use /products/:id as per your route
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`, // Use /products/:id as per your route
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByIdQuery // Export the new delete mutation
} = api;