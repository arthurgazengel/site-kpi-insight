import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProductDistribution } from "@/components/dashboard/ProductDistribution";
import { CampaignList } from "@/components/dashboard/CampaignList";
import { AddDataForm } from "@/components/dashboard/AddDataForm";
import { DailyKPI, Campaign, ProductPerformance } from "@/types/marketing";
import { TrendingUp, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";

// Mock data initial
const generateMockData = (): DailyKPI[] => {
  const data: DailyKPI[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      id: `mock-${i}`,
      date: date.toISOString().split("T")[0],
      sales: Math.random() * 5000 + 2000,
      orders: Math.floor(Math.random() * 50 + 20),
      averageOrderValue: 0,
      productType: ["e-liquides", "cigarettes-electroniques", "accessoires"][Math.floor(Math.random() * 3)],
      campaignName: ["Promo été", "Black Friday", "Organique"][Math.floor(Math.random() * 3)],
    });
  }
  
  return data.map(item => ({
    ...item,
    averageOrderValue: item.sales / item.orders,
  }));
};

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promo été 2024",
    startDate: "2024-06-01",
    status: "active",
    budget: 5000,
    spent: 3200,
    revenue: 15600,
  },
  {
    id: "2",
    name: "Black Friday",
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    status: "active",
    budget: 10000,
    spent: 8500,
    revenue: 42000,
  },
];

const Index = () => {
  const [kpiData, setKpiData] = useState<DailyKPI[]>(generateMockData());

  const handleAddData = (newData: DailyKPI) => {
    setKpiData(prev => [...prev, newData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  };

  // Calculs des KPIs
  const totalSales = kpiData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = kpiData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalSales / totalOrders;
  const conversionRate = 3.2; // Mock conversion rate

  // Product distribution
  const productPerformance: ProductPerformance[] = Object.entries(
    kpiData.reduce((acc, item) => {
      acc[item.productType] = (acc[item.productType] || 0) + item.sales;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, sales]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    sales,
    orders: kpiData.filter(d => d.productType === category).reduce((sum, item) => sum + item.orders, 0),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Dashboard Marketing</h1>
          <p className="text-muted-foreground">Suivi des performances Vapoter.fr</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Ventes totales"
            value={`${totalSales.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€`}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Commandes"
            value={totalOrders}
            icon={ShoppingCart}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Panier moyen"
            value={`${averageOrderValue.toFixed(2)}€`}
            icon={TrendingUp}
            trend={{ value: 3.1, isPositive: true }}
          />
          <StatsCard
            title="Taux de conversion"
            value={`${conversionRate}%`}
            icon={BarChart3}
            trend={{ value: -0.5, isPositive: false }}
            subtitle="Sur 30 jours"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SalesChart data={kpiData} />
          <ProductDistribution data={productPerformance} />
        </div>

        {/* Campaigns and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CampaignList campaigns={initialCampaigns} />
          <AddDataForm onAddData={handleAddData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
