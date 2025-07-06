import { pgTable, serial, timestamp, primaryKey, text } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { workspaces } from "./workspaces";
import { rolesEnum } from "./roles";

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workspaceId: serial("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: rolesEnum("role").notNull().default("MEMBER"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  // Create a composite primary key to ensure a user can only be in a workspace once.
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.workspaceId] }),
  })
);