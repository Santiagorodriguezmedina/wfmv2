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
  expensesCreate: Expenses[];
}

export interface Sales {
  saleId: string;
  productId: string; 
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid: string;
  createdAt: string;
}

export interface NewSales {
  productId: string; 
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid: string;
  createdAt: string;
}

export interface Expenses {
  expenseId: string;
  productId: string;  
  productName: string; 
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid : string;
  createdAt: string;
}

export interface NewExpenses {
  productId: string;  
  productName: string; 
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  userid : string;
  createdAt: string;
}



export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Sales", "Expenses"],
  endpoints: (build) => ({

    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

  //###########################################EXPENSES#################################################
  
    getExpenses: build.query<Expenses[], string | void>({
      query: (search) => ({
        url: "/expenses",
        params: search ? { search } : {},
      }),
      providesTags: ["Expenses"],
    }),

    createExpenses: build.mutation<Expenses, NewExpenses>({
      query: (newExpenses) => ({
        url: "/expenses",
        method: "POST",
        body: newExpenses,
      }),
      invalidatesTags: ["Expenses"],
    }),

  //###########################################PRODUCTS#################################################
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
  useGetExpensesQuery,
  useCreateExpensesMutation,
  //useGetProductsByIdQuery // Export the new delete mutation
} = api;