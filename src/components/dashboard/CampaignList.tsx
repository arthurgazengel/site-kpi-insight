import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@/types/marketing";
import { Progress } from "@/components/ui/progress";

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList = ({ campaigns }: CampaignListProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opérations marketing</CardTitle>
        <CardDescription>Campagnes actives et leur performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => {
          const budgetUsed = (campaign.spent / campaign.budget) * 100;
          const roi = campaign.spent > 0 ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100 : 0;

          return (
            <div key={campaign.id} className="space-y-2 p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{campaign.name}</h4>
                <Badge variant={getStatusVariant(campaign.status)}>
                  {getStatusLabel(campaign.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Budget utilisé</p>
                  <p className="font-medium text-foreground">
                    {campaign.spent.toLocaleString()}€ / {campaign.budget.toLocaleString()}€
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenu généré</p>
                  <p className="font-medium text-foreground">{campaign.revenue.toLocaleString()}€</p>
                </div>
              </div>

              <Progress value={budgetUsed} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{budgetUsed.toFixed(0)}% du budget</span>
                <span className={roi > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                  ROI: {roi.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
