import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertSalesSchema, 
  insertExpenseSchema, 
  insertAssetSchema, 
  insertCapitalSchema, 
  insertLiabilitySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Sales routes (protected)
  app.get("/api/sales", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const sales = await storage.getSalesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
        res.json(sales);
      } else {
        const sales = await storage.getSales();
        res.json(sales);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.post("/api/sales", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSalesSchema.parse(req.body);
      const sales = await storage.createSales(validatedData);
      res.status(201).json(sales);
    } catch (error) {
      res.status(400).json({ message: "Invalid sales data", error });
    }
  });

  app.delete("/api/sales/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteSales(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Sales record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sales" });
    }
  });

  // Expenses routes (protected)
  app.get("/api/expenses", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const expenses = await storage.getExpensesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
        res.json(expenses);
      } else {
        const expenses = await storage.getExpenses();
        res.json(expenses);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data", error });
    }
  });

  app.delete("/api/expenses/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteExpense(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Expense record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Assets routes (protected)
  app.get("/api/assets", isAuthenticated, async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.post("/api/assets", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Invalid asset data", error });
    }
  });

  app.delete("/api/assets/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteAsset(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Asset record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // Capital routes (protected)
  app.get("/api/capital", isAuthenticated, async (req, res) => {
    try {
      const capital = await storage.getCapital();
      res.json(capital);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capital" });
    }
  });

  app.post("/api/capital", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCapitalSchema.parse(req.body);
      const capital = await storage.createCapital(validatedData);
      res.status(201).json(capital);
    } catch (error) {
      res.status(400).json({ message: "Invalid capital data", error });
    }
  });

  app.delete("/api/capital/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteCapital(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Capital record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete capital" });
    }
  });

  // Liabilities routes (protected)
  app.get("/api/liabilities", isAuthenticated, async (req, res) => {
    try {
      const liabilities = await storage.getLiabilities();
      res.json(liabilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch liabilities" });
    }
  });

  app.post("/api/liabilities", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLiabilitySchema.parse(req.body);
      const liability = await storage.createLiability(validatedData);
      res.status(201).json(liability);
    } catch (error) {
      res.status(400).json({ message: "Invalid liability data", error });
    }
  });

  app.delete("/api/liabilities/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteLiability(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Liability record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete liability" });
    }
  });

  // Financial summary route (protected)
  app.get("/api/financial-summary", isAuthenticated, async (req, res) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const [dailySales, dailyExpenses, assets, capital, liabilities] = await Promise.all([
        storage.getSalesByDateRange(startOfDay, endOfDay),
        storage.getExpensesByDateRange(startOfDay, endOfDay),
        storage.getAssets(),
        storage.getCapital(),
        storage.getLiabilities()
      ]);

      const dailySalesTotal = dailySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
      const dailyExpensesTotal = dailyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const totalAssets = assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
      const dailyCapitalTotal = capital.reduce((sum, cap) => sum + parseFloat(cap.amount), 0);
      const totalLiabilities = liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
      const netProfit = dailySalesTotal - dailyExpensesTotal;

      res.json({
        dailySales: dailySalesTotal,
        netProfit,
        dailyExpenses: dailyExpensesTotal,
        totalAssets,
        dailyCapital: dailyCapitalTotal,
        totalLiabilities
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
