import { useQuery } from "@tanstack/react-query";
import { ScanBarcode, TrendingUp, Receipt, Building, Coins, CreditCard, Plus, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialMetricsProps {
  onOpenSalesModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenAssetModal: () => void;
  onOpenCapitalModal: () => void;
  onOpenLiabilityModal: () => void;
  startDate: string;
  endDate: string;
}

interface FinancialSummary {
  dailySales: number;
  netProfit: number;
  dailyExpenses: number;
  totalAssets: number;
  dailyCapital: number;
  totalLiabilities: number;
}

export default function FinancialMetrics({
  onOpenSalesModal,
  onOpenExpenseModal,
  onOpenAssetModal,
  onOpenCapitalModal,
  onOpenLiabilityModal,
}: FinancialMetricsProps) {
  const { data: financialSummary, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/financial-summary"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Penjualan per Hari",
      value: formatCurrency(financialSummary?.dailySales || 0),
      icon: ScanBarcode,
      color: "primary",
      action: onOpenSalesModal,
      actionIcon: Plus,
      change: "+12.5%",
      changeLabel: "dari kemarin",
      testId: "metric-daily-sales"
    },
    {
      title: "Profit Bersih",
      value: formatCurrency(financialSummary?.netProfit || 0),
      icon: TrendingUp,
      color: "secondary",
      action: () => {},
      actionIcon: Eye,
      change: "+8.3%",
      changeLabel: "margin profit",
      testId: "metric-net-profit"
    },
    {
      title: "Pengeluaran Harian",
      value: formatCurrency(financialSummary?.dailyExpenses || 0),
      icon: Receipt,
      color: "accent",
      action: onOpenExpenseModal,
      actionIcon: Plus,
      change: "+5.2%",
      changeLabel: "dari kemarin",
      testId: "metric-daily-expenses"
    },
    {
      title: "Total Asset",
      value: formatCurrency(financialSummary?.totalAssets || 0),
      icon: Building,
      color: "primary",
      action: onOpenAssetModal,
      actionIcon: Plus,
      change: "+2.1%",
      changeLabel: "dari bulan lalu",
      testId: "metric-total-assets"
    },
    {
      title: "Modal Harian",
      value: formatCurrency(financialSummary?.dailyCapital || 0),
      icon: Coins,
      color: "secondary",
      action: onOpenCapitalModal,
      actionIcon: Plus,
      change: "0%",
      changeLabel: "tetap",
      testId: "metric-daily-capital"
    },
    {
      title: "Total Kewajiban",
      value: formatCurrency(financialSummary?.totalLiabilities || 0),
      icon: CreditCard,
      color: "destructive",
      action: onOpenLiabilityModal,
      actionIcon: Plus,
      change: "-1.5%",
      changeLabel: "dari bulan lalu",
      testId: "metric-total-liabilities"
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card 
            key={metric.title} 
            className="metric-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
            data-testid={metric.testId}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}/10 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`text-${metric.color} text-xl h-5 w-5`} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={metric.action}
                  className={`text-${metric.color} hover:text-${metric.color}/80`}
                  data-testid={`button-${metric.testId.replace('metric-', '')}`}
                >
                  <metric.actionIcon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-foreground" data-testid={`${metric.testId}-value`}>
                  {metric.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs ${metric.change.startsWith('+') ? 'text-secondary' : metric.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'} mr-1`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{metric.changeLabel}</span>
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-${metric.color}/5 to-transparent rounded-full transform translate-x-8 translate-y-8`}></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
