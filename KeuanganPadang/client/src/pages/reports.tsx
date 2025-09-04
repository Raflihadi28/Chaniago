import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Filter, Calendar, TrendingUp, Receipt, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sales, Expense } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const { toast } = useToast();

  // Calculate date range based on period selection
  const getDateRange = () => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    
    if (selectedPeriod === "current-month") {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      return { startDate: startDate.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10) };
    } else if (selectedPeriod === "current-year") {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      return { startDate: startDate.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10) };
    }
    
    return { startDate: "", endDate: "" };
  };

  const { startDate, endDate } = getDateRange();

  const { data: sales = [] } = useQuery<Sales[]>({
    queryKey: ["/api/sales", { startDate, endDate }],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", { startDate, endDate }],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const downloadSalesReport = () => {
    const csvContent = [
      ["LAPORAN PENJUALAN", ""],
      ["Periode", selectedPeriod === "current-month" ? `Bulan ${selectedMonth}/${selectedYear}` : `Tahun ${selectedYear}`],
      ["Tanggal Cetak", new Date().toLocaleDateString('id-ID')],
      ["", ""],
      ["Tanggal", "Menu", "Kategori", "Qty", "Harga", "Total", "Catatan"],
      ...sales.map(sale => [
        new Date(sale.datetime).toLocaleDateString('id-ID'),
        sale.menuItem,
        sale.category,
        sale.quantity,
        sale.price,
        sale.total,
        sale.notes || ""
      ]),
      ["", ""],
      ["RINGKASAN", ""],
      ["Total Penjualan", formatCurrency(sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0))],
      ["Total Transaksi", sales.length],
      ["Total Qty", sales.reduce((sum, sale) => sum + sale.quantity, 0)]
    ].map(row => Array.isArray(row) ? row.join(",") : row).join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-penjualan-${selectedPeriod}-${selectedYear}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan penjualan telah diunduh",
    });
  };

  const downloadExpenseReport = () => {
    const csvContent = [
      ["LAPORAN PENGELUARAN", ""],
      ["Periode", selectedPeriod === "current-month" ? `Bulan ${selectedMonth}/${selectedYear}` : `Tahun ${selectedYear}`],
      ["Tanggal Cetak", new Date().toLocaleDateString('id-ID')],
      ["", ""],
      ["Tanggal", "Kategori", "Deskripsi", "Jumlah", "Metode Bayar", "Catatan"],
      ...expenses.map(expense => [
        new Date(expense.datetime).toLocaleDateString('id-ID'),
        expense.category,
        expense.description,
        expense.amount,
        expense.paymentMethod,
        expense.notes || ""
      ]),
      ["", ""],
      ["RINGKASAN", ""],
      ["Total Pengeluaran", formatCurrency(expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0))],
      ["Total Transaksi", expenses.length]
    ].map(row => Array.isArray(row) ? row.join(",") : row).join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-pengeluaran-${selectedPeriod}-${selectedYear}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan pengeluaran telah diunduh",
    });
  };

  const downloadTransactionReport = () => {
    const allTransactions = [
      ...sales.map(sale => ({
        date: sale.datetime,
        type: 'Penjualan',
        description: `Penjualan ${sale.menuItem} (${sale.category})`,
        amount: parseFloat(sale.total),
        isIncome: true
      })),
      ...expenses.map(expense => ({
        date: expense.datetime,
        type: 'Pengeluaran',
        description: `${expense.category} - ${expense.description}`,
        amount: parseFloat(expense.amount),
        isIncome: false
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const csvContent = [
      ["LAPORAN TRANSAKSI", ""],
      ["Periode", selectedPeriod === "current-month" ? `Bulan ${selectedMonth}/${selectedYear}` : `Tahun ${selectedYear}`],
      ["Tanggal Cetak", new Date().toLocaleDateString('id-ID')],
      ["", ""],
      ["Tanggal", "Tipe", "Deskripsi", "Jumlah", "Kategori"],
      ...allTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString('id-ID'),
        transaction.type,
        transaction.description,
        transaction.isIncome ? transaction.amount : -transaction.amount,
        transaction.isIncome ? "Pemasukan" : "Pengeluaran"
      ]),
      ["", ""],
      ["RINGKASAN", ""],
      ["Total Pemasukan", formatCurrency(sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0))],
      ["Total Pengeluaran", formatCurrency(expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0))],
      ["Saldo Bersih", formatCurrency(sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0) - expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0))]
    ].map(row => Array.isArray(row) ? row.join(",") : row).join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-transaksi-${selectedPeriod}-${selectedYear}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan transaksi telah diunduh",
    });
  };

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const netIncome = totalSales - totalExpenses;

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Generate dan download berbagai laporan keuangan</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Penjualan</p>
                <p className="text-2xl font-bold text-secondary">{formatCurrency(totalSales)}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-secondary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Receipt className="text-destructive h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Laba Bersih</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(netIncome)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="text-primary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Periode Laporan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Periode</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger data-testid="select-report-period">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Bulan Ini</SelectItem>
                  <SelectItem value="current-year">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tahun</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger data-testid="select-report-year">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPeriod === "current-month" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Bulan</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger data-testid="select-report-month">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Laporan Penjualan</TabsTrigger>
          <TabsTrigger value="expenses">Laporan Pengeluaran</TabsTrigger>
          <TabsTrigger value="transactions">Laporan Transaksi</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Laporan Penjualan</span>
                </CardTitle>
                <Button 
                  onClick={downloadSalesReport}
                  className="bg-secondary text-secondary-foreground space-x-2"
                  data-testid="download-sales-report-btn"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Menu</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.slice(0, 10).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.datetime).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell className="font-medium">{sale.menuItem}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sale.category}</Badge>
                        </TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(parseFloat(sale.total))}</TableCell>
                      </TableRow>
                    ))}
                    {sales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Tidak ada data penjualan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Transaksi</p>
                    <p className="font-semibold">{sales.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Qty</p>
                    <p className="font-semibold">{sales.reduce((sum, sale) => sum + sale.quantity, 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Penjualan</p>
                    <p className="font-bold text-secondary">{formatCurrency(totalSales)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Laporan Pengeluaran</span>
                </CardTitle>
                <Button 
                  onClick={downloadExpenseReport}
                  className="bg-destructive text-destructive-foreground space-x-2"
                  data-testid="download-expense-report-btn"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Metode Bayar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.slice(0, 10).map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.datetime).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell className="font-medium text-destructive">
                          {formatCurrency(parseFloat(expense.amount))}
                        </TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                    {expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Tidak ada data pengeluaran
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Transaksi</p>
                    <p className="font-semibold">{expenses.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Pengeluaran</p>
                    <p className="font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Laporan Transaksi Gabungan</span>
                </CardTitle>
                <Button 
                  onClick={downloadTransactionReport}
                  className="bg-primary text-primary-foreground space-x-2"
                  data-testid="download-transaction-report-btn"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...sales.slice(0, 5).map(sale => ({
                      id: sale.id,
                      date: sale.datetime,
                      type: 'Penjualan',
                      description: `${sale.menuItem} (${sale.category})`,
                      amount: parseFloat(sale.total),
                      isIncome: true
                    })), ...expenses.slice(0, 5).map(expense => ({
                      id: expense.id,
                      date: expense.datetime,
                      type: 'Pengeluaran',
                      description: `${expense.category} - ${expense.description}`,
                      amount: parseFloat(expense.amount),
                      isIncome: false
                    }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.isIncome ? "default" : "destructive"}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className={`font-medium ${transaction.isIncome ? 'text-secondary' : 'text-destructive'}`}>
                          {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {sales.length === 0 && expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          Tidak ada data transaksi
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Pemasukan</p>
                    <p className="font-bold text-secondary">{formatCurrency(totalSales)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Pengeluaran</p>
                    <p className="font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo Bersih</p>
                    <p className={`font-bold ${netIncome >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {formatCurrency(netIncome)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}