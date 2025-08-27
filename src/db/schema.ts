import { pgEnum } from "drizzle-orm/pg-core";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "pending",
  "waiting_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
]);
export const customersTable = pgTable("customers", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  document: text().notNull().unique(),
  email: text().notNull().unique(),
  phone: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const orderTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  customerId: uuid()
    .references(() => customersTable.id)
    .notNull(),
  order_number: text().notNull(),
  total_value: integer().notNull(),
  status: statusEnum("status").notNull().default("pending"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .references(() => orderTable.id)
    .notNull(),
  product_name: text().notNull(),
  quantity: integer().notNull(),
  unit_value: integer().notNull(),
});

export const notificationLogsTable = pgTable("notification_logs", {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .references(() => orderTable.id)
    .notNull(),
  old_status: statusEnum("status").notNull(),
  new_status: statusEnum("status").notNull(),
  message: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
