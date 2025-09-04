import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sales, Expense } from "@shared/schema";

interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  description: string;
  amount: number;
  time: string;
  category: string;
}

export default function RecentTransactions() {
  const { data: sales = [] } = useQuery<Sales[]>({
    queryKey: ["/api/sales"],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  // Combine and sort recent transactions
  const transactions: Transaction[] = [
    ...sales.slice(0, 5).map(sale => ({
      id: sale.id,
      type: 'sale' as const,
      description: `Penjualan ${sale.menuItem}`,
      amount: parseFloat(sale.total),
      time: new Date(sale.datetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      category: 'Penjualan'
    })),
    ...expenses.slice(0, 5).map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      description: expense.description,
      amount: parseFloat(expense.amount),
      time: new Date(expense.datetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      category: expense.category
    }))
  ].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <Card data-testid="recent-transactions">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Transaksi Terbaru</h3>
              <p className="text-sm text-muted-foreground">Aktivitas keuangan hari ini</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground"
              data-testid="button-view-all-transactions"
            >
              Lihat Semua
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8" data-testid="no-transactions">
                <p className="text-muted-foreground">Belum ada transaksi hari ini</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'sale' 
                        ? 'bg-secondary/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'sale' ? (
                        <ArrowUp className="text-secondary h-4 w-4" />
                      ) : (
                        <ArrowDown className="text-destructive h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`transaction-description-${transaction.id}`}>
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hari ini, {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'sale' ? 'text-secondary' : 'text-destructive'
                    }`} data-testid={`transaction-amount-${transaction.id}`}>
                      {transaction.type === 'sale' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
