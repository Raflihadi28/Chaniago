import { 
  type Sales, 
  type Expense, 
  type Asset, 
  type Capital, 
  type Liability,
  type User,
  type UpsertUser,
  type InsertSales,
  type InsertExpense,
  type InsertAsset,
  type InsertCapital,
  type InsertLiability
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Sales
  getSales(): Promise<Sales[]>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sales[]>;
  createSales(sales: InsertSales): Promise<Sales>;
  deleteSales(id: string): Promise<boolean>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;

  // Assets
  getAssets(): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  deleteAsset(id: string): Promise<boolean>;

  // Capital
  getCapital(): Promise<Capital[]>;
  createCapital(capital: InsertCapital): Promise<Capital>;
  deleteCapital(id: string): Promise<boolean>;

  // Liabilities
  getLiabilities(): Promise<Liability[]>;
  createLiability(liability: InsertLiability): Promise<Liability>;
  deleteLiability(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private sales: Map<string, Sales>;
  private expenses: Map<string, Expense>;
  private assets: Map<string, Asset>;
  private capital: Map<string, Capital>;
  private liabilities: Map<string, Liability>;
  private users: Map<string, User>;

  constructor() {
    this.sales = new Map();
    this.expenses = new Map();
    this.assets = new Map();
    this.capital = new Map();
    this.liabilities = new Map();
    this.users = new Map();
  }

  // User methods (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const existingUser = this.users.get(userData.id!);
    
    const user: User = {
      ...userData,
      id: userData.id || randomUUID(),
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
    };
    
    this.users.set(user.id, user);
    return user;
  }

  // Sales methods
  async getSales(): Promise<Sales[]> {
    return Array.from(this.sales.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sales[]> {
    return Array.from(this.sales.values()).filter(sale => {
      const saleDate = new Date(sale.datetime);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  async createSales(insertSales: InsertSales): Promise<Sales> {
    const id = randomUUID();
    const sales: Sales = {
      ...insertSales,
      id,
      createdAt: new Date(),
      category: insertSales.category ?? "dine-in",
      notes: insertSales.notes ?? null,
    };
    this.sales.set(id, sales);
    return sales;
  }

  async deleteSales(id: string): Promise<boolean> {
    return this.sales.delete(id);
  }

  // Expenses methods
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => {
      const expenseDate = new Date(expense.datetime);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
      notes: insertExpense.notes ?? null,
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Assets methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      ...insertAsset,
      id,
      createdAt: new Date(),
      description: insertAsset.description ?? null,
    };
    this.assets.set(id, asset);
    return asset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Capital methods
  async getCapital(): Promise<Capital[]> {
    return Array.from(this.capital.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createCapital(insertCapital: InsertCapital): Promise<Capital> {
    const id = randomUUID();
    const capital: Capital = {
      ...insertCapital,
      id,
      createdAt: new Date(),
      description: insertCapital.description ?? null,
    };
    this.capital.set(id, capital);
    return capital;
  }

  async deleteCapital(id: string): Promise<boolean> {
    return this.capital.delete(id);
  }

  // Liabilities methods
  async getLiabilities(): Promise<Liability[]> {
    return Array.from(this.liabilities.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createLiability(insertLiability: InsertLiability): Promise<Liability> {
    const id = randomUUID();
    const liability: Liability = {
      ...insertLiability,
      id,
      createdAt: new Date(),
      notes: insertLiability.notes ?? null,
      status: insertLiability.status ?? "pending",
    };
    this.liabilities.set(id, liability);
    return liability;
  }

  async deleteLiability(id: string): Promise<boolean> {
    return this.liabilities.delete(id);
  }
}

// Import database storage implementation
import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage for production deployment  
export const storage = new DatabaseStorage();
