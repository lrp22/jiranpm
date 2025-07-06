import { relations } from "drizzle-orm";
import { user, session } from "./auth";
import { workspaces } from "./workspaces";
import { workspaceMembers } from "./workspace-members";
import { projects } from "./projects";

// A user can be a member of many workspaces and have many sessions
export const usersRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  memberships: many(workspaceMembers),
}));

// NEW: Define the other side of the user-session relationship.
// Each session belongs to exactly one user.
export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId], // The foreign key in the 'session' table
    references: [user.id], // The primary key in the 'user' table
  }),
}));

// A workspace can have many members
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));

// Each membership belongs to one user and one workspace
export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(user, {
      fields: [workspaceMembers.userId],
      references: [user.id],
    }),
  })
);
