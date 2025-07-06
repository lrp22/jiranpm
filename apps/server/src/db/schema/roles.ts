import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["ADMIN", "MEMBER", "PENDING"]);
