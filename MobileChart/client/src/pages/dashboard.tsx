import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, ChefHat, Package, Store, Calendar, Download, Filter, Plus, Utensils, Coffee, Menu, X, Home, BarChart3, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChaniagoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  // Data transaksi khusus rumah makan Padang
  const transactions = [
    { id: 1, date: '2024-08-20', type: 'income', category: 'Penjualan Dine-in', amount: 2500000, description: 'Penjualan harian dine-in', items: 45 },
    { id: 2, date: '2024-08-20', type: 'income', category: 'Penjualan Takeaway', amount: 1800000, description: 'Penjualan takeaway & delivery', items: 32 },
    { id: 3, date: '2024-08-20', type: 'expense', category: 'Bahan Baku', amount: 800000, description: 'Daging sapi, ayam, sayuran', supplier: 'Pasar Raya' },
    { id: 4, date: '2024-08-21', type: 'expense', category: 'Gaji Karyawan', amount: 450000, description: 'Gaji harian koki & pelayan', staff: 6 },
    { id: 5, date: '2024-08-21', type: 'income', category: 'Catering', amount: 3200000, description: 'Catering acara pernikahan', portions: 120 },
    { id: 6, date: '2024-08-21', type: 'expense', category: 'Utilitas', amount: 200000, description: 'Listrik, gas, air', outlet: 'Cabang Utama' },
    { id: 7, date: '2024-08-22', type: 'expense', category: 'Transportasi', amount: 150000, description: 'Delivery & pembelian bahan', trips: 8 },
    { id: 8, date: '2024-08-22', type: 'income', category: 'Penjualan Online', amount: 950000, description: 'GoFood & GrabFood', orders: 28 },
  ];

  const dailySalesData = [
    { date: '20 Agu', dineIn: 2500000, takeaway: 1800000, online: 950000, catering: 0 },
    { date: '21 Agu', dineIn: 2800000, takeaway: 1600000, online: 1200000, catering: 3200000 },
    { date: '22 Agu', dineIn: 3200000, takeaway: 2100000, online: 1400000, catering: 0 },
    { date: '23 Agu', dineIn: 2900000, takeaway: 1900000, online: 1100000, catering: 1800000 },
    { date: '24 Agu', dineIn: 3500000, takeaway: 2300000, online: 1600000, catering: 0 },
    { date: '25 Agu', dineIn: 4200000, takeaway: 2800000, online: 1800000, catering: 2500000 },
    { date: '26 Agu', dineIn: 3800000, takeaway: 2400000, online: 1500000, catering: 0 },
  ];

  const menuPerformance = [
    { menu: 'Rendang Daging', sold: 85, revenue: 3400000, cost: 1700000, profit: 1700000 },
    { menu: 'Ayam Pop', sold: 72, revenue: 2160000, cost: 1080000, profit: 1080000 },
    { menu: 'Gulai Kambing', sold: 45, revenue: 2250000, cost: 1350000, profit: 900000 },
    { menu: 'Dendeng Balado', sold: 38, revenue: 1520000, cost: 760000, profit: 760000 },
    { menu: 'Ikan Bakar', sold: 55, revenue: 1650000, cost: 990000, profit: 660000 },
    { menu: 'Sayur Nangka', sold: 92, revenue: 1380000, cost: 460000, profit: 920000 },
  ];

  const expenseCategories = [
    { name: 'Bahan Baku', value: 12500000, color: '#f97316', percentage: 45 },
    { name: 'Gaji Karyawan', value: 8500000, color: '#06b6d4', percentage: 31 },
    { name: 'Utilitas', value: 2800000, color: '#8b5cf6', percentage: 10 },
    { name: 'Sewa Tempat', value: 2000000, color: '#10b981', percentage: 7 },
    { name: 'Transportasi', value: 1200000, color: '#f59e0b', percentage: 4 },
    { name: 'Lainnya', value: 800000, color: '#ef4444', percentage: 3 },
  ];

  // Neraca khusus rumah makan
  const balanceSheet = {
    assets: {
      current: {
        kas: 15000000,
        bankBCA: 45000000,
        piutangCatering: 8500000,
        persediaanBahan: 6500000,
      },
      fixed: {
        peralatanDapur: 85000000,
        mejaKursi: 25000000,
        kendaraanDelivery: 120000000,
        bangunanResto: 450000000,
      }
    },
    liabilities: {
      current: {
        hutangSupplier: 4200000,
        gajiTerutang: 3500000,
        pajakTerutang: 2800000,
      },
      longTerm: {
        kreditUsaha: 180000000,
        sewaPancangLahan: 24000000,
      }
    }
  };

  // Calculations
  const totalIncome = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  , [transactions]);

  const totalExpense = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  , [transactions]);

  const netIncome = totalIncome - totalExpense;

  const totalAssets = useMemo(() => {
    const current = Object.values(balanceSheet.assets.current).reduce((sum, val) => sum + val, 0);
    const fixed = Object.values(balanceSheet.assets.fixed).reduce((sum, val) => sum + val, 0);
    return current + fixed;
  }, [balanceSheet]);

  const totalLiabilities = useMemo(() => {
    const current = Object.values(balanceSheet.liabilities.current).reduce((sum, val) => sum + val, 0);
    const longTerm = Object.values(balanceSheet.liabilities.longTerm).reduce((sum, val) => sum + val, 0);
    return current + longTerm;
  }, [balanceSheet]);

  const equity = totalAssets - totalLiabilities;

  const totalDailySales = useMemo(() => {
    const latest = dailySalesData[dailySalesData.length - 1];
    return latest.dineIn + latest.takeaway + latest.online + latest.catering;
  }, [dailySalesData]);

  const avgDailyCustomers = 145;
  const avgOrderValue = totalDailySales / avgDailyCustomers;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, amount, icon: Icon, trend, color = 'blue', subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 touch-manipulation">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {typeof amount === 'number' ? formatCurrency(amount) : amount}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}% dari minggu lalu
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: Store, mobileLabel: 'Home' },
    { id: 'sales', name: 'Penjualan', icon: ShoppingCart, mobileLabel: 'Sales' },
    { id: 'menu', name: 'Performa Menu', icon: Utensils, mobileLabel: 'Menu' },
    { id: 'transactions', name: 'Transaksi', icon: DollarSign, mobileLabel: 'Transaksi' },
    { id: 'balance', name: 'Neraca', icon: TrendingUp, mobileLabel: 'Neraca' },
    { id: 'reports', name: 'Laporan', icon: FileText, mobileLabel: 'Laporan' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileNavOpen(false);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileNav}
          data-testid="mobile-nav-overlay"
        />
      )}
      
      {/* Mobile Navigation Drawer */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 lg:hidden ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      }`} data-testid="mobile-nav-drawer">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <ChefHat className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">RM Chaniago</h2>
                <p className="text-xs text-gray-600">Dashboard Mobile</p>
              </div>
            </div>
            <button 
              onClick={closeMobileNav}
              className="p-2 rounded-lg hover:bg-gray-100 touch-manipulation"
              data-testid="button-close-mobile-nav"
            >
              <X className="text-gray-600 w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                  activeTab === item.id
                    ? 'bg-orange-100 text-orange-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`nav-item-${item.id}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 touch-manipulation"
              data-testid="button-mobile-menu"
            >
              <Menu className="text-gray-600 w-6 h-6" />
            </button>
            
            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                <ChefHat className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rumah Makan Chaniago</h1>
                <p className="text-gray-600 text-sm">Dashboard Manajemen Keuangan</p>
              </div>
            </div>
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <ChefHat className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">RM Chaniago</h1>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 touch-manipulation"
                data-testid="select-date-range"
              >
                <option value="today">Hari Ini</option>
                <option value="week">7 Hari</option>
                <option value="month">30 Hari</option>
                <option value="quarter">3 Bulan</option>
              </select>
              <button className="hidden sm:flex px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 items-center text-sm touch-manipulation transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="sm:hidden p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 touch-manipulation transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors touch-manipulation ${
                  activeTab === item.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid={`desktop-tab-${item.id}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6" data-testid="overview-content">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Penjualan Hari Ini" 
                amount={totalDailySales} 
                icon={ShoppingCart} 
                trend={15.2}
                color="green"
                subtitle={`${avgDailyCustomers} pelanggan`}
              />
              <StatCard 
                title="Rata-rata Per Order" 
                amount={avgOrderValue} 
                icon={Coffee} 
                trend={8.5}
                color="blue"
                subtitle="Nilai pesanan rata-rata"
              />
              <StatCard 
                title="Profit Bersih" 
                amount={netIncome} 
                icon={TrendingUp} 
                trend={12.3}
                color="purple"
                subtitle="Keuntungan periode ini"
              />
              <StatCard 
                title="Total Aset" 
                amount={totalAssets} 
                icon={Store} 
                trend={5.1}
                color="orange"
                subtitle="Nilai total aset"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    <span className="hidden sm:inline">Trend Penjualan Harian</span>
                    <span className="sm:hidden">Trend Penjualan</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation">
                    <Package className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value / 1000000}M`} 
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Area type="monotone" dataKey="dineIn" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} name="Dine In" />
                      <Area type="monotone" dataKey="takeaway" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.8} name="Takeaway" />
                      <Area type="monotone" dataKey="online" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} name="Online" />
                      <Area type="monotone" dataKey="catering" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Catering" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-orange-600" />
                    <span className="hidden sm:inline">Komposisi Pengeluaran</span>
                    <span className="sm:hidden">Pengeluaran</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation">
                    <Package className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => isMobile ? `${percentage}%` : `${name} ${percentage}%`}
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation">
                  <Plus className="text-orange-600 w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">Transaksi Baru</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation">
                  <BarChart3 className="text-blue-600 w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">Hitung Profit</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation">
                  <Package className="text-green-600 w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">Cek Stok</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation">
                  <Download className="text-purple-600 w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">Download</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Aktivitas Terbaru
                </h3>
                <button className="text-orange-600 hover:text-orange-800 font-medium text-sm touch-manipulation">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? 
                          <ShoppingCart className="w-4 h-4 text-green-600" /> :
                          <Package className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.category}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      {transaction.items && (
                        <p className="text-xs text-gray-500">{transaction.items} item</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-6" data-testid="sales-content">
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Dine In" 
                amount={3800000} 
                icon={Utensils} 
                trend={12}
                color="orange"
                subtitle="+12% hari ini"
              />
              <StatCard 
                title="Takeaway" 
                amount={2400000} 
                icon={ShoppingCart} 
                trend={8}
                color="blue"
                subtitle="+8% hari ini"
              />
              <StatCard 
                title="Online" 
                amount={1500000} 
                icon={Coffee} 
                trend={15}
                color="purple"
                subtitle="+15% hari ini"
              />
              <StatCard 
                title="Catering" 
                amount={2500000} 
                icon={Users} 
                trend={-5}
                color="green"
                subtitle="-5% hari ini"
              />
            </div>

            {/* Detailed Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Penjualan per Kategori</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 80 : 60}
                      fontSize={12}
                    />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} fontSize={12} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="dineIn" fill="#f97316" name="Dine In" />
                    <Bar dataKey="takeaway" fill="#06b6d4" name="Takeaway" />
                    <Bar dataKey="online" fill="#8b5cf6" name="Online" />
                    <Bar dataKey="catering" fill="#10b981" name="Catering" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Menu Performance Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6" data-testid="menu-content">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-orange-600" />
                  Performa Menu Mingguan
                </h3>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center touch-manipulation">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Filter Menu</span>
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center touch-manipulation">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Tambah Menu</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Best Sellers Chart */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Menu Terlaris (Qty Terjual)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={menuPerformance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" fontSize={12} />
                        <YAxis 
                          dataKey="menu" 
                          type="category" 
                          width={80} 
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip />
                        <Bar dataKey="sold" fill="#f97316" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Profit by Menu */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Keuntungan per Menu</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={menuPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="menu" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80} 
                          fontSize={10}
                        />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} fontSize={12} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="profit" fill="#10b981" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Menu Table */}
              {isMobile ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Detail Menu</h4>
                  {menuPerformance.map((menu, index) => {
                    const margin = ((menu.profit / menu.revenue) * 100).toFixed(1);
                    const performance = menu.sold >= 70 ? 'excellent' : menu.sold >= 50 ? 'good' : 'average';
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Utensils className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="font-medium text-gray-900">{menu.menu}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            performance === 'excellent' ? 'bg-green-100 text-green-800' :
                            performance === 'good' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {performance === 'excellent' ? 'Sangat Baik' :
                             performance === 'good' ? 'Baik' : 'Perlu Perhatian'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Qty Terjual:</span>
                            <span className="font-medium ml-1">{menu.sold}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium ml-1">{formatCurrency(menu.revenue)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Profit:</span>
                            <span className="font-medium ml-1 text-green-600">{formatCurrency(menu.profit)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Margin:</span>
                            <span className="font-medium ml-1">{margin}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Desktop Table */
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Menu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Qty Terjual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Profit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Margin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {menuPerformance.map((menu, index) => {
                        const margin = ((menu.profit / menu.revenue) * 100).toFixed(1);
                        const performance = menu.sold >= 70 ? 'excellent' : menu.sold >= 50 ? 'good' : 'average';
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                  <Utensils className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="font-medium text-gray-900">{menu.menu}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{menu.sold}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(menu.revenue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(menu.cost)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{formatCurrency(menu.profit)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{margin}%</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                performance === 'excellent' ? 'bg-green-100 text-green-800' :
                                performance === 'good' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {performance === 'excellent' ? 'Sangat Baik' :
                                 performance === 'good' ? 'Baik' : 'Perlu Perhatian'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6" data-testid="transactions-content">
            {/* Transaction Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                title="Total Pemasukan" 
                amount={totalIncome} 
                icon={TrendingUp} 
                color="green"
              />
              <StatCard 
                title="Total Pengeluaran" 
                amount={totalExpense} 
                icon={TrendingDown} 
                color="red"
              />
              <StatCard 
                title="Net Income" 
                amount={netIncome} 
                icon={DollarSign} 
                color="purple"
              />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium touch-manipulation">
                  Lihat Semua
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                    transaction.type === 'income' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className="w-4 h-4 text-green-600" /> :
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.category}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.items ? `${transaction.items} items • ` : ''}
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Balance Sheet Tab */}
        {activeTab === 'balance' && (
          <div className="space-y-6" data-testid="balance-content">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                title="Total Aset" 
                amount={totalAssets} 
                icon={TrendingUp} 
                color="blue"
              />
              <StatCard 
                title="Total Kewajiban" 
                amount={totalLiabilities} 
                icon={TrendingDown} 
                color="red"
              />
              <StatCard 
                title="Modal" 
                amount={equity} 
                icon={DollarSign} 
                color="green"
              />
            </div>

            {/* Assets Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian Aset</h3>
              <div className="space-y-4">
                {/* Current Assets */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">Aset Lancar</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kas</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.current.kas)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank BCA</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.current.bankBCA)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Piutang Catering</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.current.piutangCatering)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Persediaan Bahan</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.current.persediaanBahan)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Aset Lancar</span>
                      <span>{formatCurrency(Object.values(balanceSheet.assets.current).reduce((a, b) => a + b, 0))}</span>
                    </div>
                  </div>
                </div>

                {/* Fixed Assets */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">Aset Tetap</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peralatan Dapur</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.fixed.peralatanDapur)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meja & Kursi</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.fixed.mejaKursi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kendaraan Delivery</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.fixed.kendaraanDelivery)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bangunan Resto</span>
                      <span className="font-medium">{formatCurrency(balanceSheet.assets.fixed.bangunanResto)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Aset Tetap</span>
                      <span>{formatCurrency(Object.values(balanceSheet.assets.fixed).reduce((a, b) => a + b, 0))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liabilities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                  KEWAJIBAN
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Kewajiban Lancar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hutang Supplier</span>
                        <span className="font-medium">{formatCurrency(balanceSheet.liabilities.current.hutangSupplier)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gaji Terutang</span>
                        <span className="font-medium">{formatCurrency(balanceSheet.liabilities.current.gajiTerutang)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pajak Terutang</span>
                        <span className="font-medium">{formatCurrency(balanceSheet.liabilities.current.pajakTerutang)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Kewajiban Lancar</span>
                        <span>{formatCurrency(Object.values(balanceSheet.liabilities.current).reduce((a, b) => a + b, 0))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Kewajiban Jangka Panjang</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kredit Usaha</span>
                        <span className="font-medium">{formatCurrency(balanceSheet.liabilities.longTerm.kreditUsaha)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sewa Pancang Lahan</span>
                        <span className="font-medium">{formatCurrency(balanceSheet.liabilities.longTerm.sewaPancangLahan)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Kewajiban Jangka Panjang</span>
                        <span>{formatCurrency(Object.values(balanceSheet.liabilities.longTerm).reduce((a, b) => a + b, 0))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-gray-300 pt-3 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-red-600">
                      <span>TOTAL KEWAJIBAN</span>
                      <span>{formatCurrency(totalLiabilities)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  MODAL
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Modal Awal</span>
                    <span className="font-medium">{formatCurrency(500000000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Laba Ditahan</span>
                    <span className="font-medium">{formatCurrency(equity - 500000000)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                      <span>TOTAL MODAL</span>
                      <span>{formatCurrency(equity)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Verifikasi Neraca</h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total Aset:</span>
                        <span className="font-medium">{formatCurrency(totalAssets)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kewajiban + Modal:</span>
                        <span className="font-medium">{formatCurrency(totalLiabilities + equity)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-600 border-t pt-2 mt-2">
                        <span>Selisih:</span>
                        <span>{formatCurrency(Math.abs(totalAssets - (totalLiabilities + equity)))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6" data-testid="reports-content">
            {/* Report Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Laporan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                  <BarChart3 className="text-blue-600 w-8 h-8 mb-2" />
                  <span className="font-medium text-gray-900">Laporan Penjualan</span>
                  <span className="text-sm text-gray-600 text-center">Summary penjualan harian, mingguan, bulanan</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                  <DollarSign className="text-green-600 w-8 h-8 mb-2" />
                  <span className="font-medium text-gray-900">Laporan Keuangan</span>
                  <span className="text-sm text-gray-600 text-center">Profit & loss, cash flow, balance sheet</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                  <Package className="text-orange-600 w-8 h-8 mb-2" />
                  <span className="font-medium text-gray-900">Laporan Stok</span>
                  <span className="text-sm text-gray-600 text-center">Inventory dan penggunaan bahan baku</span>
                </button>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Laporan Terbaru</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-red-600 w-5 h-5" />
                    <div>
                      <p className="font-medium text-gray-900">Laporan Penjualan Agustus</p>
                      <p className="text-sm text-gray-600">Generated: 26 Agu 2024</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium touch-manipulation">
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-green-600 w-5 h-5" />
                    <div>
                      <p className="font-medium text-gray-900">Data Transaksi Agustus</p>
                      <p className="text-sm text-gray-600">Generated: 25 Agu 2024</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium touch-manipulation">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
        <div className="grid grid-cols-3 h-16">
          {navigationItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors touch-manipulation ${
                activeTab === item.id ? 'text-orange-600' : 'text-gray-500'
              }`}
              data-testid={`bottom-nav-${item.id}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.mobileLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChaniagoDashboard;
