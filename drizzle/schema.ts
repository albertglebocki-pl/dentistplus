import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "DOCTOR", "ADMIN"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").default("USER").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personalData = pgTable("personal_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  address: text("address"),
  phoneNumber: text("phone_number"),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  visitDate: date("visit_date").notNull(),
  patientId: integer("patient_id").references(() => users.id),
});
