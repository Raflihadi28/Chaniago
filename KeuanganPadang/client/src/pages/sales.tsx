import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Filter, Search, Download, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SalesModal from "@/components/modals/sales-modal";
import { Sales } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SalesPage() {
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sales = [], isLoading } = useQuery<Sales[]>({
    queryKey: ["/api/sales", { startDate, endDate }],
  });

  const deleteSalesMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/sales/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data penjualan telah dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus data penjualan",
        variant: "destructive",
      });
    },
  });

  const salesCategories = [
    { value: "all", label: "Semua Kategori" },
    { value: "dine-in", label: "Dine In" },
    { value: "takeaway", label: "Takeaway" },
    { value: "online", label: "Online" },
    { value: "catering", label: "Catering" },
  ];

  const filteredSales = sales.filter((sale) => {
    const matchesCategory = selectedCategory === "all" || sale.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      sale.menuItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'dine-in': return 'default';
      case 'takeaway': return 'secondary';
      case 'online': return 'outline';
      case 'catering': return 'destructive';
      default: return 'default';
    }
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

  const downloadReport = () => {
    // Simple CSV download
    const csvContent = [
      ["Tanggal", "Menu", "Kategori", "Qty", "Harga", "Total", "Catatan"].join(","),
      ...filteredSales.map(sale => [
        new Date(sale.datetime).toLocaleDateString('id-ID'),
        sale.menuItem,
        sale.category,
        sale.quantity,
        sale.price,
        sale.total,
        sale.notes || ""
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-penjualan-${startDate}-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan penjualan telah diunduh",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Penjualan</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua data penjualan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadReport}
            variant="outline"
            className="space-x-2"
            data-testid="download-sales-report"
          >
            <Download className="h-4 w-4" />
            <span>Download Laporan</span>
          </Button>
          <Button 
            onClick={() => setSalesModalOpen(true)}
            className="bg-primary text-primary-foreground space-x-2"
            data-testid="add-sales-button"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Penjualan</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Penjualan</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSales)}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="text-primary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold text-foreground">{filteredSales.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Plus className="text-secondary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Qty</p>
                <p className="text-2xl font-bold text-foreground">{totalQuantity}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Filter className="text-accent h-5 w-5" />
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
            <span>Filter & Pencarian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Dari Tanggal</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start-date-sales"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sampai Tanggal</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date-sales"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {salesCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cari Menu</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari menu atau catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-sales"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Penjualan</CardTitle>
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
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">Tidak ada data penjualan</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id} data-testid={`sales-row-${sale.id}`}>
                        <TableCell>
                          {new Date(sale.datetime).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell className="font-medium">{sale.menuItem}</TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(sale.category)}>
                            {salesCategories.find(c => c.value === sale.category)?.label || sale.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{formatCurrency(sale.price)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sale.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSalesMutation.mutate(sale.id)}
                            disabled={deleteSalesMutation.isPending}
                            className="text-destructive hover:text-destructive"
                            data-testid={`delete-sales-${sale.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <SalesModal 
        open={salesModalOpen} 
        onOpenChange={setSalesModalOpen} 
      />
    </div>
  );
}