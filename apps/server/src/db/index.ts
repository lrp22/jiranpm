// apps/server/src/db/index.ts - CORRECTED

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg"; // 1. Import the Pool from the 'pg' library

import * as authSchema from "./schema/auth";
import * as workspaceSchema from "./schema/workspaces";
import * as workspaceMembersSchema from "./schema/workspace-members";
import * as rolesSchema from "./schema/roles";
import * as relations from "./schema/relations";
import * as projectsSchema from "./schema/projects";

const schema = {
  ...authSchema,
  ...workspaceSchema,
  ...relations,
  ...rolesSchema,
  ...workspaceMembersSchema,
  ...projectsSchema,
};

// 2. Create a new Pool instance using your connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 3. Pass BOTH the pool and the schema to drizzle
export const db = drizzle(pool, { schema });
