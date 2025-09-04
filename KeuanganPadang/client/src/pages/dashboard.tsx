import { useState } from "react";
import { ChartLine, Calendar, Bell } from "lucide-react";
import FinancialMetrics from "@/components/financial-metrics";
import ChartsSection from "@/components/charts-section";
import RecentTransactions from "@/components/recent-transactions";
import SalesModal from "@/components/modals/sales-modal";
import ExpenseModal from "@/components/modals/expense-modal";
import AssetModal from "@/components/modals/asset-modal";
import CapitalModal from "@/components/modals/capital-modal";
import LiabilityModal from "@/components/modals/liability-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date.toISOString().slice(0, 10);
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [capitalModalOpen, setCapitalModalOpen] = useState(false);
  const [liabilityModalOpen, setLiabilityModalOpen] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleApplyFilter = () => {
    // Filter functionality will be handled by the child components
    // They will read the date values from props
    window.location.reload(); // Simple approach for demo
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-primary-foreground text-lg h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Sistem Laporan Keuangan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm text-muted-foreground">{getCurrentDate()}</span>
              </div>
              <Button variant="ghost" size="icon" data-testid="notification-button">
                <Bell className="text-muted-foreground h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Date Filter */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Filter Periode</h2>
                <p className="text-sm text-muted-foreground">Pilih rentang tanggal untuk melihat laporan keuangan</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-foreground">Dari:</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm"
                    data-testid="input-start-date"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-foreground">Sampai:</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm"
                    data-testid="input-end-date"
                  />
                </div>
                <Button 
                  onClick={handleApplyFilter}
                  className="bg-primary text-primary-foreground"
                  data-testid="button-apply-filter"
                >
                  <ChartLine className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Metrics */}
      <FinancialMetrics
        onOpenSalesModal={() => setSalesModalOpen(true)}
        onOpenExpenseModal={() => setExpenseModalOpen(true)}
        onOpenAssetModal={() => setAssetModalOpen(true)}
        onOpenCapitalModal={() => setCapitalModalOpen(true)}
        onOpenLiabilityModal={() => setLiabilityModalOpen(true)}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Charts Section */}
      <ChartsSection startDate={startDate} endDate={endDate} />

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Modals */}
      <SalesModal 
        open={salesModalOpen} 
        onOpenChange={setSalesModalOpen} 
      />
      <ExpenseModal 
        open={expenseModalOpen} 
        onOpenChange={setExpenseModalOpen} 
      />
      <AssetModal 
        open={assetModalOpen} 
        onOpenChange={setAssetModalOpen} 
      />
      <CapitalModal 
        open={capitalModalOpen} 
        onOpenChange={setCapitalModalOpen} 
      />
      <LiabilityModal 
        open={liabilityModalOpen} 
        onOpenChange={setLiabilityModalOpen} 
      />
    </div>
  );
}
