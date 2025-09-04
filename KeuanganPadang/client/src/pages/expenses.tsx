import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Filter, Search, Download, Trash2, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ExpenseModal from "@/components/modals/expense-modal";
import { Expense } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
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

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", { startDate, endDate }],
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/expenses/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data pengeluaran telah dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus data pengeluaran",
        variant: "destructive",
      });
    },
  });

  const expenseCategories = [
    { value: "all", label: "Semua Kategori" },
    { value: "bahan-baku", label: "Bahan Baku" },
    { value: "gaji", label: "Gaji Karyawan" },
    { value: "utilitas", label: "Listrik & Air" },
    { value: "peralatan", label: "Peralatan" },
    { value: "transportasi", label: "Transportasi" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
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
      case 'bahan-baku': return 'default';
      case 'gaji': return 'secondary';
      case 'utilitas': return 'outline';
      case 'peralatan': return 'destructive';
      case 'transportasi': return 'default';
      default: return 'outline';
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const downloadReport = () => {
    const csvContent = [
      ["Tanggal", "Kategori", "Deskripsi", "Jumlah", "Metode Bayar", "Catatan"].join(","),
      ...filteredExpenses.map(expense => [
        new Date(expense.datetime).toLocaleDateString('id-ID'),
        expense.category,
        expense.description,
        expense.amount,
        expense.paymentMethod,
        expense.notes || ""
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-pengeluaran-${startDate}-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Laporan pengeluaran telah diunduh",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Pengeluaran</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua data pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadReport}
            variant="outline"
            className="space-x-2"
            data-testid="download-expenses-report"
          >
            <Download className="h-4 w-4" />
            <span>Download Laporan</span>
          </Button>
          <Button 
            onClick={() => setExpenseModalOpen(true)}
            className="bg-accent text-accent-foreground space-x-2"
            data-testid="add-expense-button"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Pengeluaran</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold text-foreground">{filteredExpenses.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Rata-rata per Transaksi</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0)}
                </p>
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
                data-testid="input-start-date-expenses"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sampai Tanggal</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date-expenses"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter-expenses">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Cari Deskripsi</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari deskripsi atau catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-expenses"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Pengeluaran</CardTitle>
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
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Metode Bayar</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">Tidak ada data pengeluaran</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} data-testid={`expense-row-${expense.id}`}>
                        <TableCell>
                          {new Date(expense.datetime).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(expense.category)}>
                            {expenseCategories.find(c => c.value === expense.category)?.label || expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell className="font-medium text-destructive">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell className="text-sm">{expense.paymentMethod}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {expense.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteExpenseMutation.mutate(expense.id)}
                            disabled={deleteExpenseMutation.isPending}
                            className="text-destructive hover:text-destructive"
                            data-testid={`delete-expense-${expense.id}`}
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

      <ExpenseModal 
        open={expenseModalOpen} 
        onOpenChange={setExpenseModalOpen} 
      />
    </div>
  );
}