import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Target,
  Calendar,
  Users,
  Activity
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart, Area, AreaChart } from "recharts";
import { AddDataForm } from "@/components/dashboard/AddDataForm";
import { DailyKPI, Campaign } from "@/types/marketing";

// Mock data
const mockCampaign: Campaign = {
  id: "1",
  name: "Promo été 2024 - E-liquides",
  startDate: "2024-06-01",
  endDate: "2024-08-31",
  status: "active",
  budget: 8000,
  spent: 5200,
  revenue: 28600,
};

const generateMockOperationData = (): DailyKPI[] => {
  const data: DailyKPI[] = [];
  const startDate = new Date("2024-06-01");
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const orders = Math.floor(Math.random() * 30 + 15);
    const sales = orders * (Math.random() * 80 + 40);
    
    data.push({
      id: `op-${i}`,
      date: date.toISOString().split("T")[0],
      sales,
      orders,
      averageOrderValue: sales / orders,
      productType: "e-liquides",
      campaignName: mockCampaign.name,
    });
  }
  
  return data;
};

const OperationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<DailyKPI[]>(generateMockOperationData());
  const campaign = mockCampaign; // In real app, fetch by id

  const handleAddData = (newData: DailyKPI) => {
    setKpiData(prev => [...prev, { ...newData, campaignName: campaign.name }].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  };

  // Calculations
  const totalOrders = kpiData.reduce((sum, item) => sum + item.orders, 0);
  const totalSales = kpiData.reduce((sum, item) => sum + item.sales, 0);
  const averageOrderValue = totalSales / totalOrders;
  const budgetUsed = (campaign.spent / campaign.budget) * 100;
  const roi = ((campaign.revenue - campaign.spent) / campaign.spent) * 100;
  const profitMargin = ((campaign.revenue - campaign.spent) / campaign.revenue) * 100;

  // Chart data
  const dailyData = kpiData.map(item => ({
    date: new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    ventes: Math.round(item.sales),
    commandes: item.orders,
  }));

  const weeklyData = kpiData.reduce((acc, item, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = { week: `S${weekIndex + 1}`, ventes: 0, commandes: 0 };
    }
    acc[weekIndex].ventes += item.sales;
    acc[weekIndex].commandes += item.orders;
    return acc;
  }, [] as Array<{ week: string; ventes: number; commandes: number }>);

  const cumulativeData = kpiData.map((item, index) => ({
    date: new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    revenue: kpiData.slice(0, index + 1).reduce((sum, d) => sum + d.sales, 0),
    target: ((index + 1) / kpiData.length) * campaign.revenue,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
              <Badge variant="default">En cours</Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(campaign.startDate).toLocaleDateString("fr-FR")} - 
                {campaign.endDate && ` ${new Date(campaign.endDate).toLocaleDateString("fr-FR")}`}
              </span>
            </div>
          </div>
        </div>

        {/* KPIs en grand */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-success">+{roi.toFixed(0)}%</span>
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Bénéfice: {(campaign.revenue - campaign.spent).toLocaleString()}€
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenu total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">
                {campaign.revenue.toLocaleString()}€
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Objectif: {(campaign.revenue * 1.2).toLocaleString()}€
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Panier moyen: {averageOrderValue.toFixed(2)}€
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">
                {budgetUsed.toFixed(0)}%
              </div>
              <Progress value={budgetUsed} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {campaign.spent.toLocaleString()}€ / {campaign.budget.toLocaleString()}€
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance cumulée */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance cumulée vs Objectif</CardTitle>
              <CardDescription>Revenu généré au fil du temps comparé à la cible</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    name="Revenu réel (€)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Objectif (€)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ventes par semaine */}
          <Card>
            <CardHeader>
              <CardTitle>Performance hebdomadaire</CardTitle>
              <CardDescription>Ventes par semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar 
                    dataKey="ventes" 
                    fill="hsl(var(--chart-1))" 
                    radius={[8, 8, 0, 0]}
                    name="Ventes (€)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commandes quotidiennes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes quotidiennes</CardTitle>
              <CardDescription>Évolution du nombre de commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commandes" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))", r: 3 }}
                    name="Commandes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Métriques additionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Taux de conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">3.8%</div>
              <p className="text-sm text-muted-foreground mt-2">+0.5% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Visiteurs uniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12.5k</div>
              <p className="text-sm text-muted-foreground mt-2">Sur la période de la campagne</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Marge bénéficiaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{profitMargin.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mt-2">Excellent retour sur investissement</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Data Form */}
        <AddDataForm onAddData={handleAddData} />
      </div>
    </div>
  );
};

export default OperationDetail;
