import { pgTable, varchar, text, decimal, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { products } from "./schema";
import { priceLists } from "./schema";

// Product Price Lists - Custom pricing per product per price list
export const productPriceLists = pgTable("product_price_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  priceListId: varchar("price_list_id").references(() => priceLists.id).notNull(),
  customPrice: decimal("custom_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  markup: decimal("markup", { precision: 5, scale: 2 }), // percentage markup over cost
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price Management Audit Log
export const priceAuditLog = pgTable("price_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  priceListId: varchar("price_list_id").references(() => priceLists.id),
  changeType: text("change_type").notNull(), // "base_price", "custom_price", "markup", "bulk_update"
  oldValue: decimal("old_value", { precision: 10, scale: 2 }),
  newValue: decimal("new_value", { precision: 10, scale: 2 }),
  reason: text("reason"),
  changedBy: varchar("changed_by").notNull(), // staff id or system
  changedAt: timestamp("changed_at").defaultNow(),
});

export type ProductPriceList = typeof productPriceLists.$inferSelect;
export type InsertProductPriceList = typeof productPriceLists.$inferInsert;
export type PriceAuditLog = typeof priceAuditLog.$inferSelect;
export type InsertPriceAuditLog = typeof priceAuditLog.$inferInsert;