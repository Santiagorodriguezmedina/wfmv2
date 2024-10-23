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
  salesCreate: Sales[];

}

export interface Sales {
  saleId: string;
  productId: string;  // Add this field if needed
  timestamp: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  userid: string;
}

export interface NewSales {
  productId: string;  // Add this field if needed
  timestamp: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  userid: string;
}


export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Sales"],
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
    // getProductsById: build.query<Product, string>({
    //   query: (id) => `/products/${id}`, // Adjust based on your route
    //   providesTags: ["Products"],
    // }),

    updateProduct: build.mutation<Product, { productId: string; updatedProduct: Partial<Product> }>({
      query: ({ productId, updatedProduct }) => ({
        url: `/products/${productId}`,
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


    //###########################################SALES#################################################

    getSales: build.query<Sales[], string | void>({
      query: (search) => ({
        url: "/sales",
        params: search ? { search } : {},
      }),
      providesTags: ["Sales"],
    }),

    createSales: build.mutation<Sales, NewSales>({
      query: (newSales) => ({
        url: "/sales",
        method: "POST",
        body: newSales,
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSalesQuery,
  useCreateSalesMutation,
  //useGetProductsByIdQuery // Export the new delete mutation
} = api;