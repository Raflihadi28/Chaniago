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
  type InsertLiability,
  sales,
  expenses,
  assets,
  capital,
  liabilities,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  // Sales methods
  async getSales(): Promise<Sales[]> {
    return await db.select().from(sales).orderBy(sales.createdAt);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sales[]> {
    return await db.select()
      .from(sales)
      .where(and(
        gte(sales.datetime, startDate),
        lte(sales.datetime, endDate)
      ))
      .orderBy(sales.datetime);
  }

  async createSales(insertSales: InsertSales): Promise<Sales> {
    const [newSales] = await db.insert(sales).values(insertSales).returning();
    return newSales;
  }

  async deleteSales(id: string): Promise<boolean> {
    const result = await db.delete(sales).where(eq(sales.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Expenses methods
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(expenses.createdAt);
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return await db.select()
      .from(expenses)
      .where(and(
        gte(expenses.datetime, startDate),
        lte(expenses.datetime, endDate)
      ))
      .orderBy(expenses.datetime);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(insertExpense).returning();
    return newExpense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Assets methods
  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets).orderBy(assets.createdAt);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(insertAsset).returning();
    return newAsset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Capital methods
  async getCapital(): Promise<Capital[]> {
    return await db.select().from(capital).orderBy(capital.createdAt);
  }

  async createCapital(insertCapital: InsertCapital): Promise<Capital> {
    const [newCapital] = await db.insert(capital).values(insertCapital).returning();
    return newCapital;
  }

  async deleteCapital(id: string): Promise<boolean> {
    const result = await db.delete(capital).where(eq(capital.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Liabilities methods
  async getLiabilities(): Promise<Liability[]> {
    return await db.select().from(liabilities).orderBy(liabilities.createdAt);
  }

  async createLiability(insertLiability: InsertLiability): Promise<Liability> {
    const [newLiability] = await db.insert(liabilities).values(insertLiability).returning();
    return newLiability;
  }

  async deleteLiability(id: string): Promise<boolean> {
    const result = await db.delete(liabilities).where(eq(liabilities.id, id));
    return (result.rowCount || 0) > 0;
  }
}