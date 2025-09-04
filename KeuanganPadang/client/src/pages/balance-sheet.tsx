import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calculator, Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sales, Expense, Asset, Capital, Liability } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface BalanceSheetData {
  assets: {
    currentAssets: number;
    fixedAssets: number;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: number;
    longTermLiabilities: number;
    totalLiabilities: number;
  };
  equity: {
    capital: number;
    retainedEarnings: number;
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export default function BalanceSheetPage() {
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

  const { data: assets = [] } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  const { data: capital = [] } = useQuery<Capital[]>({
    queryKey: ["/api/capital"],
  });

  const { data: liabilities = [] } = useQuery<Liability[]>({
    queryKey: ["/api/liabilities"],
  });

  // Calculate balance sheet data
  const calculateBalanceSheet = (): BalanceSheetData => {
    // Assets calculation
    const currentAssets = assets
      .filter(asset => ['kas', 'bank', 'inventori'].includes(asset.type))
      .reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    const fixedAssets = assets
      .filter(asset => ['peralatan', 'properti', 'kendaraan'].includes(asset.type))
      .reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    const totalAssets = currentAssets + fixedAssets;

    // Liabilities calculation
    const currentLiabilities = liabilities
      .filter(liability => ['utang-supplier', 'utang-gaji', 'utang-sewa'].includes(liability.type))
      .reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
    
    const longTermLiabilities = liabilities
      .filter(liability => ['pinjaman-bank'].includes(liability.type))
      .reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
    
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    // Equity calculation
    const totalCapital = capital.reduce((sum, cap) => sum + parseFloat(cap.amount), 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const retainedEarnings = totalRevenue - totalExpenses;
    const totalEquity = totalCapital + retainedEarnings;

    return {
      assets: {
        currentAssets,
        fixedAssets,
        totalAssets,
      },
      liabilities: {
        currentLiabilities,
        longTermLiabilities,
        totalLiabilities,
      },
      equity: {
        capital: totalCapital,
        retainedEarnings,
        totalEquity,
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
    };
  };

  const balanceSheetData = calculateBalanceSheet();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const downloadReport = () => {
    const csvContent = [
      ["NERACA", ""],
      ["Periode", selectedPeriod === "current-month" ? `Bulan ${selectedMonth}/${selectedYear}` : `Tahun ${selectedYear}`],
      ["", ""],
      ["AKTIVA", ""],
      ["Aktiva Lancar", formatCurrency(balanceSheetData.assets.currentAssets)],
      ["Aktiva Tetap", formatCurrency(balanceSheetData.assets.fixedAssets)],
      ["Total Aktiva", formatCurrency(balanceSheetData.assets.totalAssets)],
      ["", ""],
      ["KEWAJIBAN & MODAL", ""],
      ["Kewajiban Lancar", formatCurrency(balanceSheetData.liabilities.currentLiabilities)],
      ["Kewajiban Jangka Panjang", formatCurrency(balanceSheetData.liabilities.longTermLiabilities)],
      ["Total Kewajiban", formatCurrency(balanceSheetData.liabilities.totalLiabilities)],
      ["", ""],
      ["Modal", formatCurrency(balanceSheetData.equity.capital)],
      ["Laba Ditahan", formatCurrency(balanceSheetData.equity.retainedEarnings)],
      ["Total Modal", formatCurrency(balanceSheetData.equity.totalEquity)],
      ["", ""],
      ["Total Kewajiban & Modal", formatCurrency(balanceSheetData.totalLiabilitiesAndEquity)]
    ].map(row => row.join(",")).join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neraca-${selectedPeriod}-${selectedYear}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan neraca telah diunduh",
    });
  };

  const isBalanced = Math.abs(balanceSheetData.assets.totalAssets - balanceSheetData.totalLiabilitiesAndEquity) < 1;

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
          <h1 className="text-3xl font-bold text-foreground">Neraca Keuangan</h1>
          <p className="text-muted-foreground">Laporan posisi keuangan pada periode tertentu</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadReport}
            variant="outline"
            className="space-x-2"
            data-testid="download-balance-sheet"
          >
            <Download className="h-4 w-4" />
            <span>Download Neraca</span>
          </Button>
        </div>
      </div>

      {/* Balance Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Status Neraca</h3>
              <p className="text-sm text-muted-foreground">
                Aktiva vs Kewajiban + Modal
              </p>
            </div>
            <div className="text-right">
              <Badge variant={isBalanced ? "default" : "destructive"} className="text-sm">
                {isBalanced ? "Seimbang" : "Tidak Seimbang"}
                {isBalanced ? (
                  <TrendingUp className="ml-2 h-4 w-4" />
                ) : (
                  <TrendingDown className="ml-2 h-4 w-4" />
                )}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Selisih: {formatCurrency(Math.abs(balanceSheetData.assets.totalAssets - balanceSheetData.totalLiabilitiesAndEquity))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Periode</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Periode</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger data-testid="select-period">
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
                <SelectTrigger data-testid="select-year">
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
                  <SelectTrigger data-testid="select-month">
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

      {/* Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>AKTIVA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Aktiva Lancar</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.assets.currentAssets)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Aktiva Tetap</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.assets.fixedAssets)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-bold text-primary">TOTAL AKTIVA</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(balanceSheetData.assets.totalAssets)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>KEWAJIBAN & MODAL</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Kewajiban Lancar</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.liabilities.currentLiabilities)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Kewajiban Jangka Panjang</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.liabilities.longTermLiabilities)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b">
                  <TableCell className="font-semibold">Total Kewajiban</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(balanceSheetData.liabilities.totalLiabilities)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Modal</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.equity.capital)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Laba Ditahan</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(balanceSheetData.equity.retainedEarnings)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b">
                  <TableCell className="font-semibold">Total Modal</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(balanceSheetData.equity.totalEquity)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-bold text-primary">TOTAL KEWAJIBAN & MODAL</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(balanceSheetData.totalLiabilitiesAndEquity)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}