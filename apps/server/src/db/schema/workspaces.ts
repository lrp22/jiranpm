// apps/server/src/db/schema/workspaces.ts
import { pgTable, serial, timestamp, varchar, text } from "drizzle-orm/pg-core"; // Import text
import { user } from "./auth";

export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(), // The workspace's own ID can still be a number
  name: varchar("name", { length: 256 }).notNull(),
  imageUrl: text("image_url"),
  inviteCode: text("invite_code").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
