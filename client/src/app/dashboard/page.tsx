"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import CardPopularProducts from "./CardPopularProducts";


const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      {/*<CardSalesSummary />*/}
      {/*<CardPurchaseSummary />*/}
      {/*<CardExpenseSummary />*/}
    </div>
  );
};

export default Dashboard;