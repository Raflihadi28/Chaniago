import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuItem: text("menu_item").notNull(),
  category: text("category").notNull().default("dine-in"), // dine-in, takeaway, online, catering
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  datetime: timestamp("datetime").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  datetime: timestamp("datetime").notNull(),
  paymentMethod: text("payment_method").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  name: text("name").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  acquisitionDate: timestamp("acquisition_date").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const capital = pgTable("capital", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const liabilities = pgTable("liabilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  creditor: text("creditor").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertSalesSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
});

export const insertCapitalSchema = createInsertSchema(capital).omit({
  id: true,
  createdAt: true,
});

export const insertLiabilitySchema = createInsertSchema(liabilities).omit({
  id: true,
  createdAt: true,
});

export type InsertSales = z.infer<typeof insertSalesSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type InsertCapital = z.infer<typeof insertCapitalSchema>;
export type InsertLiability = z.infer<typeof insertLiabilitySchema>;

export type Sales = typeof sales.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Capital = typeof capital.$inferSelect;
export type Liability = typeof liabilities.$inferSelect;

// User types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
