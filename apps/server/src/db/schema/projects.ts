import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  imageUrl: varchar("image_url", { length: 2048 }),

  // This is the foreign key linking it to a workspace
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }), // Cascade delete

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
