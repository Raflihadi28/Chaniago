import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Download, Filter, Eye, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sales } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MenuPerformance {
  menuItem: string;
  totalSales: number;
  totalQuantity: number;
  averagePrice: number;
  totalRevenue: number;
  salesByCategory: Record<string, number>;
  performanceRank: number;
}

export default function MenuPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const { toast } = useToast();

  const { data: sales = [], isLoading } = useQuery<Sales[]>({
    queryKey: ["/api/sales", { startDate, endDate }],
  });

  // Process menu performance data
  const menuPerformanceData: MenuPerformance[] = sales.reduce((acc: Record<string, any>, sale) => {
    const menuItem = sale.menuItem;
    const quantity = sale.quantity;
    const revenue = parseFloat(sale.total);
    const price = parseFloat(sale.price);
    const category = sale.category;

    if (!acc[menuItem]) {
      acc[menuItem] = {
        menuItem,
        totalSales: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        salesByCategory: {},
        prices: []
      };
    }

    acc[menuItem].totalSales += 1;
    acc[menuItem].totalQuantity += quantity;
    acc[menuItem].totalRevenue += revenue;
    acc[menuItem].prices.push(price);
    acc[menuItem].salesByCategory[category] = (acc[menuItem].salesByCategory[category] || 0) + quantity;

    return acc;
  }, {});

  // Convert to array and add calculated fields
  const menuPerformanceArray = Object.values(menuPerformanceData).map((menu: any) => ({
    ...menu,
    averagePrice: menu.prices.length > 0 ? menu.prices.reduce((a: number, b: number) => a + b, 0) / menu.prices.length : 0,
  })).sort((a, b) => b.totalRevenue - a.totalRevenue).map((menu, index) => ({
    ...menu,
    performanceRank: index + 1
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceBadge = (rank: number) => {
    if (rank <= 3) return 'default';
    if (rank <= 6) return 'secondary';
    return 'outline';
  };

  const totalRevenue = menuPerformanceArray.reduce((sum, menu) => sum + menu.totalRevenue, 0);
  const totalQuantitySold = menuPerformanceArray.reduce((sum, menu) => sum + menu.totalQuantity, 0);
  const bestSellingMenu = menuPerformanceArray[0];

  const downloadReport = () => {
    const csvContent = [
      ["Rank", "Menu", "Total Penjualan", "Total Qty", "Total Revenue", "Harga Rata-rata", "Dine In", "Takeaway", "Online", "Catering"].join(","),
      ...menuPerformanceArray.map(menu => [
        menu.performanceRank,
        menu.menuItem,
        menu.totalSales,
        menu.totalQuantity,
        menu.totalRevenue,
        menu.averagePrice.toFixed(0),
        menu.salesByCategory['dine-in'] || 0,
        menu.salesByCategory['takeaway'] || 0,
        menu.salesByCategory['online'] || 0,
        menu.salesByCategory['catering'] || 0
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-performa-menu-${startDate}-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan performa menu telah diunduh",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performa Menu</h1>
          <p className="text-muted-foreground">Analisis kinerja setiap menu dalam periode tertentu</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadReport}
            variant="outline"
            className="space-x-2"
            data-testid="download-menu-performance-report"
          >
            <Download className="h-4 w-4" />
            <span>Download Laporan</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Qty Terjual</p>
                <p className="text-2xl font-bold text-foreground">{totalQuantitySold}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Eye className="text-secondary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jenis Menu</p>
                <p className="text-2xl font-bold text-foreground">{menuPerformanceArray.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Filter className="text-accent h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Menu Terlaris</p>
                <p className="text-lg font-bold text-foreground">
                  {bestSellingMenu?.menuItem || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Star className="text-destructive h-5 w-5" />
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
            <span>Filter Periode</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Dari Tanggal</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start-date-performance"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sampai Tanggal</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date-performance"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Performa Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Total Penjualan</TableHead>
                    <TableHead>Total Qty</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Harga Rata-rata</TableHead>
                    <TableHead>Dine In</TableHead>
                    <TableHead>Takeaway</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Catering</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuPerformanceArray.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <p className="text-muted-foreground">Tidak ada data performa menu</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    menuPerformanceArray.map((menu) => (
                      <TableRow key={menu.menuItem} data-testid={`menu-performance-${menu.menuItem}`}>
                        <TableCell>
                          <Badge variant={getPerformanceBadge(menu.performanceRank)}>
                            #{menu.performanceRank}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{menu.menuItem}</TableCell>
                        <TableCell>{menu.totalSales}</TableCell>
                        <TableCell className="font-medium">{menu.totalQuantity}</TableCell>
                        <TableCell className="font-bold text-primary">{formatCurrency(menu.totalRevenue)}</TableCell>
                        <TableCell>{formatCurrency(menu.averagePrice)}</TableCell>
                        <TableCell>{menu.salesByCategory['dine-in'] || 0}</TableCell>
                        <TableCell>{menu.salesByCategory['takeaway'] || 0}</TableCell>
                        <TableCell>{menu.salesByCategory['online'] || 0}</TableCell>
                        <TableCell>{menu.salesByCategory['catering'] || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}