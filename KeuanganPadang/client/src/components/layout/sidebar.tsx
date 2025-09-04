import { Link, useLocation } from "wouter";
import { 
  Home, 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Menu, 
  X,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar-context";

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen, toggle } = useSidebar();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Penjualan",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Pengeluaran", 
      href: "/expenses",
      icon: Receipt,
    },
    {
      title: "Performa Menu",
      href: "/menu-performance",
      icon: TrendingUp,
    },
    {
      title: "Neraca",
      href: "/balance-sheet",
      icon: Calculator,
    },
    {
      title: "Laporan Keuangan",
      href: "/reports",
      icon: FileText,
    },
  ];


  return (
    <>
      {/* Floating toggle button for desktop - positioned naturally */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className={`fixed top-4 z-50 bg-card border border-border shadow-md hover:shadow-lg transition-all duration-300 ${
          isOpen ? 'left-60' : 'left-4'
        } hidden md:flex`}
        data-testid="desktop-sidebar-toggle"
      >
        {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      </Button>

      {/* Mobile menu button - only shows when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="fixed top-4 left-4 z-50 bg-card border border-border md:hidden"
          data-testid="mobile-menu-toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <img 
                  src="KeuanganPadang\KeuanganPadang\attached_assets\chaniago.jpg" 
                  alt="Logo Chaniago" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Chaniago</h1>
                <p className="text-xs text-muted-foreground">Sistem Keuangan</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start space-x-3 h-12 ${
                      isActive 
                        ? "bg-secondary/10 text-secondary border border-secondary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => window.innerWidth < 768 && toggle()}
                    data-testid={`nav-${item.href.replace('/', '') || 'dashboard'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © Chaniago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={toggle}
          data-testid="sidebar-overlay"
        />
      )}
    </>
  );
}