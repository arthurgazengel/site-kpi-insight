import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { Campaign } from "@/types/marketing";

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promo été 2024 - E-liquides",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "active",
    budget: 8000,
    spent: 5200,
    revenue: 28600,
  },
  {
    id: "2",
    name: "Black Friday 2024",
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    status: "active",
    budget: 15000,
    spent: 12500,
    revenue: 68000,
  },
  {
    id: "3",
    name: "Lancement nouveaux pods",
    startDate: "2024-09-15",
    endDate: "2024-10-15",
    status: "completed",
    budget: 5000,
    spent: 4800,
    revenue: 22400,
  },
];

const Operations = () => {
  const navigate = useNavigate();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusVariant = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "completed":
        return "outline";
    }
  };

  const getStatusLabel = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "En cours";
      case "paused":
        return "En pause";
      case "completed":
        return "Terminée";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Opérations Marketing</h1>
            <p className="text-muted-foreground">Suivez la performance de vos campagnes Vapoter.fr</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle opération
          </Button>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const budgetUsed = (campaign.spent / campaign.budget) * 100;
            const roi = campaign.spent > 0 ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100 : 0;
            const daysRemaining = campaign.endDate 
              ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <Card 
                key={campaign.id} 
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                onClick={() => navigate(`/operation/${campaign.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(campaign.startDate)}
                        {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* ROI Highlight */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Retour sur investissement</span>
                      <TrendingUp className={`h-4 w-4 ${roi > 0 ? "text-success" : "text-destructive"}`} />
                    </div>
                    <div className={`text-3xl font-bold ${roi > 0 ? "text-success" : "text-destructive"}`}>
                      {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget utilisé</span>
                      <span className="font-medium text-foreground">{budgetUsed.toFixed(0)}%</span>
                    </div>
                    <Progress value={budgetUsed} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{campaign.spent.toLocaleString()}€</span>
                      <span>{campaign.budget.toLocaleString()}€</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <DollarSign className="h-3 w-3" />
                        <span>Revenu</span>
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {campaign.revenue.toLocaleString()}€
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Target className="h-3 w-3" />
                        <span>Dépensé</span>
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {campaign.spent.toLocaleString()}€
                      </div>
                    </div>
                  </div>

                  {/* Days Remaining */}
                  {daysRemaining !== null && daysRemaining > 0 && campaign.status === "active" && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {daysRemaining} jour{daysRemaining > 1 ? "s" : ""} restant{daysRemaining > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Operations;
