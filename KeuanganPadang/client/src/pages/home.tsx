import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartLine, 
  TrendingUp, 
  DollarSign, 
  FileText,
  LogOut,
  User
} from "lucide-react";
import { Link } from "wouter";

interface UserType {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const { user } = useAuth() as { user: UserType | null };

  const quickActions = [
    {
      title: "Dashboard Keuangan",
      description: "Lihat ringkasan performa bisnis hari ini",
      icon: ChartLine,
      href: "/",
      color: "bg-blue-500"
    },
    {
      title: "Data Penjualan",
      description: "Kelola dan analisis data penjualan",
      icon: TrendingUp,
      href: "/sales",
      color: "bg-green-500"
    },
    {
      title: "Pengeluaran",
      description: "Catat dan monitor pengeluaran bisnis",
      icon: DollarSign,
      href: "/expenses",
      color: "bg-red-500"
    },
    {
      title: "Laporan Keuangan",
      description: "Generate laporan lengkap",
      icon: FileText,
      href: "/reports",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Masakan Padang Chaniago</h1>
                <p className="text-sm text-muted-foreground">Sistem Laporan Keuangan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-foreground">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.email || 'Admin'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Selamat Datang, {user?.firstName || user?.email || 'Admin'}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Kelola keuangan restoran Anda dengan mudah dan efisien
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-border hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Getting Started */}
          <Card className="mt-12 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Mulai Kelola Keuangan Anda</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Klik salah satu menu di atas untuk mulai mencatat transaksi dan melihat laporan keuangan restoran Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90" data-testid="go-dashboard">
                    Lihat Dashboard
                  </Button>
                </Link>
                <Link href="/sales">
                  <Button variant="outline" data-testid="add-sales">
                    Tambah Penjualan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}