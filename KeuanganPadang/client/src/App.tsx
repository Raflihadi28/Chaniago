import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import SalesPage from "@/pages/sales";
import ExpensesPage from "@/pages/expenses";
import MenuPerformancePage from "@/pages/menu-performance";
import BalanceSheetPage from "@/pages/balance-sheet";
import ReportsPage from "@/pages/reports";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function MainContent() {
  const { isOpen } = useSidebar();
  
  return (
    <main 
      className={`flex-1 transition-all duration-300 ${
        isOpen ? 'ml-0 md:ml-64' : 'ml-0'
      }`}
    >
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/sales" component={SalesPage} />
        <Route path="/expenses" component={ExpensesPage} />
        <Route path="/menu-performance" component={MenuPerformancePage} />
        <Route path="/balance-sheet" component={BalanceSheetPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // Show main app with sidebar for authenticated users
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
