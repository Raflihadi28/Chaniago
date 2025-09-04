import { useQuery } from "@tanstack/react-query";
import { BarChart3, PieChart, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sales, Expense } from "@shared/schema";

interface ChartsSectionProps {
  startDate: string;
  endDate: string;
}

export default function ChartsSection({ startDate, endDate }: ChartsSectionProps) {
  const { data: sales = [], isLoading: salesLoading } = useQuery<Sales[]>({
    queryKey: ["/api/sales", { startDate, endDate }],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", { startDate, endDate }],
  });

  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <Card data-testid="chart-sales-trends">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Tren Penjualan</h3>
                <p className="text-sm text-muted-foreground">7 hari terakhir</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="bg-primary text-primary-foreground"
                  data-testid="button-chart-7days"
                >
                  7H
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  data-testid="button-chart-30days"
                >
                  30H
                </Button>
              </div>
            </div>
            <div className="chart-container h-72 bg-muted/30 rounded-lg flex items-center justify-center">
              {salesLoading ? (
                <div className="animate-pulse text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center">
                  <BarChart3 className="text-4xl text-muted-foreground mb-2 h-12 w-12 mx-auto" />
                  <p className="text-sm text-muted-foreground">Grafik Penjualan</p>
                  <p className="text-xs text-muted-foreground">
                    {sales.length} transaksi dalam periode ini
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card data-testid="chart-expense-breakdown">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Breakdown Pengeluaran</h3>
                <p className="text-sm text-muted-foreground">Bulan ini</p>
              </div>
              <Button variant="ghost" size="icon" data-testid="button-chart-options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="chart-container h-72 bg-muted/30 rounded-lg flex items-center justify-center">
              {expensesLoading ? (
                <div className="animate-pulse text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center">
                  <PieChart className="text-4xl text-muted-foreground mb-2 h-12 w-12 mx-auto" />
                  <p className="text-sm text-muted-foreground">Grafik Pie Pengeluaran</p>
                  <p className="text-xs text-muted-foreground">
                    {expenses.length} pengeluaran dalam periode ini
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
