export interface DailyKPI {
  id: string;
  date: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
  productType: string;
  campaignName: string;
}

export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  revenue: number;
}

export interface ProductPerformance {
  category: string;
  sales: number;
  orders: number;
}
