import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DailyKPI } from "@/types/marketing";

interface AddDataFormProps {
  onAddData: (data: DailyKPI) => void;
}

export const AddDataForm = ({ onAddData }: AddDataFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    sales: "",
    orders: "",
    productType: "",
    campaignName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sales || !formData.orders || !formData.productType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newData: DailyKPI = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      sales: parseFloat(formData.sales),
      orders: parseInt(formData.orders),
      averageOrderValue: parseFloat(formData.sales) / parseInt(formData.orders),
      productType: formData.productType,
      campaignName: formData.campaignName || "Organique",
    };

    onAddData(newData);
    toast.success("Données ajoutées avec succès");

    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      sales: "",
      orders: "",
      productType: "",
      campaignName: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter des données</CardTitle>
        <CardDescription>Entrez les KPIs quotidiens pour le suivi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales">Ventes (€) *</Label>
              <Input
                id="sales"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.sales}
                onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orders">Nombre de commandes *</Label>
              <Input
                id="orders"
                type="number"
                placeholder="0"
                value={formData.orders}
                onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Type de produit *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value) => setFormData({ ...formData, productType: value })}
              >
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e-liquides">E-liquides</SelectItem>
                  <SelectItem value="cigarettes-electroniques">Cigarettes électroniques</SelectItem>
                  <SelectItem value="accessoires">Accessoires</SelectItem>
                  <SelectItem value="pods">Pods</SelectItem>
                  <SelectItem value="resistances">Résistances</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="campaignName">Nom de la campagne</Label>
              <Input
                id="campaignName"
                type="text"
                placeholder="Nom de l'opération marketing (optionnel)"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Ajouter les données
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
